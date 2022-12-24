---
title: "Selenium UI Testing with Node"
description: "Using Node.js to run Selenium tests"
date: 2017-08-28T00:00:00-00:00
lastmod: 2017-08-28T00:00:00-00:00
activemenu: "testing"
---

# Selenium UI Testing with Node

By: Dan Stewart\
August 28, 2017\
[MIT License](https://mit-license.org)

Let's use Selenium to test a web page using Node, Mocha, and the Selenium Web Driver.

First we use npm init to create a package.json file. After answering the questions during the init, 
we install mocha and selenium-webdriver.

```shell
npm init
...
npm install mocha --save
npm install selenium-webdriver --save
```

package.json

```javascript
{
  "name": "stewshack-numeric-input-testing",
  "version": "1.0.0",
  "description": "Testing the Numeric Input Testing page.",
  "main": "index.js",
  "scripts": {
    "start": "./node_modules/.bin/mocha app.js -b -t 60000 --slow 30000"
  },
  "author": "Dan Stewart",
  "license": "MIT",
  "dependencies": {
    "mocha": "^3.5.0",
    "selenium-webdriver": "^3.5.0"
  }
}
```

Now we can write a test for a webpage.

app.js

```javascript
"use strict";

const pageUrl = "http://www.stewshack.com/qa/numeric"
const webdriver = require('selenium-webdriver');
const timeoutMilliseconds = 10000;

describe("Numeric test should accept a valid input.", function validInputTest() {
  it("Test for valid input", function inputTest() {
    const driver = new webdriver
    .Builder()
    .forBrowser(webdriver.Browser.CHROME)
    .build();

    driver.get(pageUrl);
    driver.findElement(webdriver.By.id("number")).sendKeys("50");
    driver.findElement(webdriver.By.id("testButton")).click();

    driver.wait(webdriver.until.elementLocated(webdriver.By.className("sorting_1")), timeoutMilliseconds);

    return driver.close();
  });
});
```