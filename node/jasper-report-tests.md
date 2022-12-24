---
title: "Testing Jasper reports using REST and Node.js"
description: "Testing Jasper reports through it's API using Node.js"
date: 2016-12-18T00:00:00-00:00
lastmod: 2018-12-02T00:00:00-00:00
activemenu: "testing"
---

# Testing Jasper Reports with Node

By: Dan Stewart\
December 2, 2018\
[MIT License](https://mit-license.org)

[Jasper Reports](https://community.jaspersoft.com/) is an open source reporting tool. They offer a REST service that 
we can use to write automated tests against.

The goal of the tests are to ensure that the report simply runs. So, it's more of a smoke test than a test for the correctness of the report.

I will be using the Git bash shell in this article.

## Setup

Open a Git bash shell and confirm that you have what you need to test a Jasper report.

```shell
$ git --version
git version 2.8.2.windows.1

$ node -v
v4.6.1

$ npm -v
3.10.9
```

Now we can set up the project structure.

```shell
$ mkdir jasper-tests
$ cd jasper-tests
$ mkdir support
$ mkdir test
```

The "support" directory will hold the module we need to run the tests. 
The "test" directory will hold all of our tests.

Using the Node Package Manager, we will create our package.json file to manage our dependencies.

```shell
$ npm init
```

You can complete the npm init questions as you see fit. Here is my initial package.json file.

package.json
```javascript
{
  "name": "jasper-tests",
  "version": "1.0.0",
  "description": "Tests for Jasper Reports",
  "main": "", 
  "author": "Dan Stewart",
  "license": "MIT",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

Now we can bring in our dependencies.

```shell
$ npm install eslint --save-dev
$ npm install lodash mocha promise request --save
```

Here is my updated package.json file.

package.json
```javascript
{
  "name": "jasper-tests",
  "version": "1.0.0",
  "description": "Tests for Jasper Reports",
  "main": "",
  "author": "Dan Stewart",
  "license": "MIT", 
  "devDependencies": {
    "eslint": "^3.9.1"
  },
  "dependencies": {
    "lodash": "^4.17.2",
    "mocha": "^3.1.2",
    "promise": "^7.1.1",
    "request": "^2.78.0"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

The first thing we added was [eslint](https://eslint.org/). It is a development dependency because we are using it to lint our JavaScript code.
Now that we have eslint, we can update the package.json file with a test to run it.

package.json
```javascript
"scripts": {
  "test": "./node_modules/.bin/eslint --color *.js */*.js"
}
```

Now we can run "npm test" and the eslint utility will check our JavaScript code.

## Jasper Report Test

Now that the setup is complete, we can start writing tests.

Our tests rely on information that might change in the future. So we are going to create a config.js file.

config.js
```javascript
"use strict";

module.exports = {
  "reportRoot": "http://reports.stewshack.com:8080/jasperserver/rest_v2/reports/",
  "reporterPassword": "P@ssw0rd!",
  "reporterUsername": "user",
  "reports": [
    "Owners/AllOwnersReport",
    "Shacks/AllShacksReport"]
};
```

Add a file named "report-runs.js" into the support directory.

Here are the contents of the file.

support/report-runs.js
```javascript
"use strict";

var request = require("request");
var Promise = require("promise");
var config = require("../config");

var exports = module.exports = {};

/*
* Verifies that a report runs.
* Jasper will return an XML object error if it does not run.
*
* Params
*
* reportPath - a string representing the Jasper report path.
*
* Returns
*
* true if the report ran and the Jasper error XML if it does not.
*
* Example
*
* var reportRan = reportRuns("http://reports.stewshack.com:8080/jasperserver/rest_v2/reports/owners/AllOwners.csv");
*/
exports.reportRuns = function reportRuns(reportPath) {
  return new Promise(
    function promiseReportRuns(fulfill, reject) {
      var body = "";
      var errorCodeFound = 0;

      var currentReportRequest = request(reportPath)
        .auth(config.reporterUsername,
          config.reporterPassword,
          false);

      currentReportRequest.on("data",
        function writeChunk(chunk) {
          body += chunk;
        });

      currentReportRequest.on("error",
        function error(err) {
          reject(err);
        });

      currentReportRequest.on("end",
        function end() {
          if (body.indexOf("errorCode") > errorCodeFound) {
            fulfill(body);
          } else {
            fulfill(true);
          }
        });
      });
  };
```		

All of our tests will use this module to verify that the report runs without parameters.

The request module will make our call to the Jasper REST service. The promise module 
will help us handle the asynchronous function that our tests will use.

We create a promise that will be fulfilled when the report is run. The caller might get back 
true if it ran without error or the error message if it failed. We will set a timeout value 
so that our promise call does not run forever.

Now that we have the module that will run the report, we can write a test for the report.

Add a file to run all of the reports into the test folder.

test/reports.js
```javascript
"use strict";

var report = require("../support/report-runs");
var config = require("../config");
var lodash = require("lodash");

var assert = require("assert");

lodash.each(config.reports, function verifyReport(reportPath) {
  describe(reportPath,
    function reportForm() {
      it("should run without error", function runReport() {
        return report.reportRuns(config.reportRoot + reportPath + ".csv").then(
          function verify(result) {
            assert.strictEqual(result, true, "The " + reportPath + " returned the error: " + result);
          });
      });
    });
});
```

## Running the Test

We can update the package.json file with the script to run the tests.

package.json
```javascript
"scripts": {
  "test": "./node_modules/.bin/eslint --color *.js */*.js",
  "start": "./node_modules/.bin/mocha test -b -t 60000 --slow 30000"
}
```

I will bail out of testing if one report fails. I set a 1 minute timeout for running 
the tests and a 30 second slow warning in mocha. You can run the tests with "npm start".