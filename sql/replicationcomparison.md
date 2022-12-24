---
title: "Replication Comparison between Different Servers"
description: "Comparing replication articles between servers"
date: 2013-09-19T00:00:00-00:00
lastmod: 2013-09-19T00:00:00-00:00
activemenu: "web"
---

# Replication Comparison between Different Servers

By: Dan Stewart\
September 19, 2013\
[MIT License](https://mit-license.org/)

## Question

How do I compare the replication articles between two servers?

## Answer

```sql
USE Distribution

SELECT prodPub.Publication AS [Prod Publication], 
  prodArticle.Article AS [Prod Article], 
  dev.Publication AS [Dev Publication], 
  dev.Article AS [Dev Article]
FROM MsArticles prodArticle
  JOIN MsPublications prodPub ON prodPub.Publication_ID = prodArticle.Publication_ID
  LEFT JOIN ( 
    SELECT devPub.Publication, devArticle.Article 
    FROM DevServer.Distribution.dbo.MsArticles devArticle 
    JOIN DevServer.Distribution.dbo.MsPublications devPub ON devPub.Publication_ID = devArticle.Publication_ID 
  ) dev ON dev.Publication = prodPub.Publication AND dev.Article = prodArticle.Article
ORDER BY prodPub.Publication, prodArticle.Article
```
This only works if you run it on production and have [linked servers](https://docs.microsoft.com/en-us/sql/relational-databases/linked-servers/create-linked-servers-sql-server-database-engine?view=sql-server-2017) to development.

Here's the scenario, you have two servers. The first server is production. The second server is development. You want to compare what you are 
replicating in production to what you are replicating on development.

Running this query shows the publications and articles between the two servers.