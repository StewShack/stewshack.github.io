---
title: "Testing file paths held in a database using Node.js"
description: "Using Node.js to test filepaths from a database using lodash, mocha, sequelize, and tedious"
date: 2016-12-18T00:00:00-00:00
lastmod: 2018-12-02T00:00:00-00:00
activemenu: "testing"
---

# Testing File Paths held in a Database with Node.js

By: Dan Stewart\
December 2, 2018\
[MIT License](https://mit-license.org)

If you have a database filled with file paths, you can use Node to verify that the files listed in the database exist on the server.

I will be using the Git bash shell in this article.

## Setup

Open a Git bash shell and confirm that you have what you need to test the file system with Node.

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
$ mkdir file-tests

$ cd file-tests

$ mkdir test
```

Using the Node Package Manager, we will create our package.json file to manage our dependencies.

```shell
$ npm init
```

You can complete the npm init questions as you see fit. Here is my initial package.json file.

package.json
```javascript
{
  "name": "file-tests",
  "version": "1.0.0",
  "description": "Tests for File Paths",
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
$ npm install lodash mocha sequelize tedious --save
```

Here is my updated package.json file.

package.json

```javascript
{
  "name": "file-tests",
  "version": "1.0.0",
  "description": "Tests for File Paths",
  "main": "",
  "author": "Dan Stewart",
  "license": "MIT", 
  "devDependencies": {
  "eslint": "^3.9.1"
},
"dependencies": {
  "lodash": "^4.17.1",
  "mocha": "^3.2.0",
  "sequelize": "^3.25.0",
  "tedious": "^1.14.0"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

The first thing we added was [eslint](https://eslint.org/). 
It is a development dependency because we are using it to lint our JavaScript code.
Now that we have eslint, we can update the package.json file with a test to run it.

package.json

```javascript
"scripts": {
  "test": "./node_modules/.bin/eslint --color *.js */*.js"
}
```

Now we can run "npm test" and the eslint utility will check our JavaScript code.

## File Path Test

Now that the setup is complete, we can start writing tests.

Our tests rely on information that might change in the future. So we are going to create a config.js file.

config.json

```javascript
"use strict";

module.exports = {
  "content": "\\\\stewfs\\docs\\",
  "contentKeys": [777,888,999],
  "database": "stewdb",
  "host": "databaseserver.stewshack.com",
  "password": "P@ssw0rd!",
  "username": "user"
};
```

Add a file to run the verification into the test folder.

test/content.js

```javascript
"use strict";

var Sequelize = require("sequelize");
var fs = require("fs");
var lodash = require("lodash");
var assert = require("assert");

var config = require("./../config");

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    "dialect": "mssql",
    "host": config.host,
    "logging": false,
    "pool": {
      "idle": 10000,
      "max": 5,
      "min": 0
    }
  });

describe("Content should exist.", function confirm() {
  if (lodash.isEmpty(config.contentKeys)) {
    return;
  }

  it("All content files exist.", function queryContent() {
    return sequelize.query(
      "SELECT '" + config.content +
      "+ '\\' + FileName AS ContentFile, " +
      "FileName " +
      "FROM Content " +
      "WHERE ContentKey IN (" +
      config.contentKeys + ")",
      { "type": sequelize.QueryTypes.SELECT })
      .then(function verifyCotentFile(contentFile) {
        lodash.each(contentFile, function verifyContentFile(value) {
          assert.strictEqual(fs.existsSync(value.ContentFile), true,
            "Missing File in " + value.FileName + ": " +
            value.ContentFile);
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

I will bail out of testing if one content file fails. I set a 1 minute timeout for running the tests 
and a 30 second slow warning in mocha. You can run the tests with "npm start".