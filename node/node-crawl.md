---
title: "Crawling a Webpage using Node.js"
description: "Crawling a webpage using Node.js and broken-link-checker"
date: 2017-08-08T00:00:00-00:00
lastmod: 2017-08-08T00:00:00-00:00
activemenu: "testing"
---

# Crawling a Webpage using Node.js

By: Dan Stewart\
August 8, 2017\
[MIT License](https://mit-license.org)

Using the Node Package Manager, we will create our package.json file to manage our dependencies.

```shell
$ npm init
```

You can complete the npm init questions as you see fit. Here is my initial package.json file.

package.json

```javascript
{
  "name": "crawl",
  "version": "1.0.0",
  "description": "Crawl a webpage",
  "main": "crawl.js", 
  "author": "Dan Stewart",
  "license": "MIT",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

Now we can bring in our dependencies.

```shell
$ npm install broken-link-checker --save
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
  "dependencies": {
    "broken-link-checker": "^0.7.6"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```		

Now that the setup is complete, we can start writing the crawler.

crawl.js

```javascript
"use strict";

const brokenLinkChecker = require("broken-link-checker");

const options = {
  "filter-level": 0
};

const siteChecker = new brokenLinkChecker.SiteChecker(options, {
  "end": function end() {
    console.log("Crawler has completed.");
  },
  "link": function link(result) {
    if (result.broken) {
      console.log(result.base.original + "," +
        "Broken URL," +
        result.url.original + "," +
        result.url.resolved + "," +
        result.url.redirected + "," +
        result.brokenReason + "\r\n");

      console.log("A broken link was found.");
    }
  }
});

siteChecker.enqueue("http://www.stewshack.com");
```

## Running the Crawler

We can update the package.json file with the script to run the crawler.

package.json

```javascript
"scripts": {
  "start": "node ./crawl.js"
},
```

Now we run it through NPM.

```shell
$ npm start
```