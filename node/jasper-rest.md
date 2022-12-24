---
title: "Jasper report using REST and Node.js"
description: "Running Jasper reports through it's API using Node.js"
date: 2016-10-07T00:00:00-00:00
lastmod: 2016-10-07T00:00:00-00:00
activemenu: "web"
---

# Jasper report using REST and Node.js

By: Dan Stewart\
October 7, 2016\
[MIT License](https://mit-license.org)

## The Short Answer

```javascript
var fs = require("fs");
var request = require("request");

var url = "http://jasperserver[-pro]/rest_v2/reports/path/to/report.pdf";

request(url)
  .auth("username", "p@ssw0rd!", false)
  .pipe(fs.createWriteStream("myfile.pdf"));
```

## The Long Answer

You have set up a [JasperReports server](https://community.jaspersoft.com) 
and would like to access a report using Node.js through the Jasper REST V2 API.

You have read through the Jasper REST v2 - Report Services documentation.

To access the report make a folder to hold your Node application.

Open the folder in your shell.

In your shell type:

```shell
npm init
```

Answer the questions to get a package.json file.

```shell
npm install request --save
```

When you were initializing the package.json you were asked for a main file the default is "index.js".

Create the main file with the contents:

index.js
```javascript
var fs = require("fs");
var request = require("request");

var url = "http://jasperserver[-pro]:port/rest_v2/reports/path/to/report.pdf";

request(url)
  .auth("username", "p@ssw0rd!", false)
  .pipe(fs.createWriteStream("myfile.pdf"));
```

We need the fs module to create the file that we are going to request from the Jasper REST service.

We need the request module to make it easy.

The URL is your server, port, and path to the report.

You can get the path by viewing the properties of your report from the server.

If your report has parameters, you will need to pass those on the URL.

In this example I am using basic authentication with the username and password in plain text.

If you do not want your login exposed to the world, you will need to research ways of hiding it.

We use Node's pipe function to write the file.

In this example I used PDF as the output, but you can change that to any output that Jasper supports.