---
title: "Replication between Different Schemas"
description: "Replicating data between servers and schemas"
date: 2017-10-04T00:00:00-00:00
lastmod: 2017-10-04T00:00:00-00:00
activemenu: "web"
---

# Replication between Different Schemas

By: Dan Stewart\
November 25, 2011\
[MIT License](https://mit-license.org/)

## Question

How do I replicate tables from different schemas?

## Short Answer

Set the destination owner in the publication to be the schema name in the subscriber.

## Long Answer

Here's the scenario, you have two databases. The first database is the publisher. The second database is the subscriber. 
You want to replicate tables from the publisher to the subscriber. You do not want to give the subscriber full rights 
to the replicated tables.

So you want to replicate the tables to a special schema on the subscriber. Setting up a schema will give you the power 
to control what the subscriber can do with the tables.

### Disclaimer

I am not a DBA, but I play one at work sometimes. I welcome your feedback.

### The Setup

Open SQL Server 2008. Create two databases. Name the first PublisherDatabase and the second SubscriberDatabase.

Inside the PublisherDatabase, run the following script to create a table.

```sql
USE PublisherDatabase
GO

CREATE TABLE Person
(
  Id UNIQUEIDENTIFIER PRIMARY KEY,
  FirstName NVARCHAR(50) NULL,
  LastName NVARCHAR(50) NULL
) ON [PRIMARY]
GO
```

Let's insert a person.

```sql
INSERT INTO Person 
  (Id, FirstName, LastName) 
VALUES 
  (NEWID(), 'Dan', 'Stewart')
```

The goal is to replicate this table to the SubscriberDatabase, but the user of the SubscriberDatabase should only have select 
rights on the table. They cannot insert, update, or delete records from the table. Creating a schema and replicating the
table to this schema is a good way to limit rights.

### Schema

Let's create the schema on the subscriber database.

1. On the SubscriberDatabase, go to the Security folder, Schemas.
1. Right-click the Schemas folder and choose new schema.
1. Name it "repl".
1. Make "dbo" the owner.
1. On the Permissions page, search for your user.
1. Allow your user to Control, Select, and View definition.
1. Deny everything else.
1. Click OK.

We now have a schema named "repl" and our user has limited rights in the schema.

### Replication

Let's set up replication.

1. Right-click on Local Publications and choose New Publication&hellip;\
  ![New Publication](/images/sql/new_publication.png)
1. This launches the New Publication Wizard.
1. Click next through the initial screens until you get to the Publication Database.
1. Choose PublisherDatabase and click next.
1. Choose transactional publication and click next.
1. Checkmark the tables that you want included in the replication.
1. Click on the article properties dropdown and select All table articles.
1. There are a ton of settings here. I would at least set copy nonclustered indexes to true.
1. Keep all of the other defaulted values.
1. Change the destination owner to repl.\
  ![Destination owner](/images/sql/destination_owner.png)
1. Click next until you get to Snapshot Agent. Check the box to create the snapshot immediately.
1. Click next and choose a Windows account to run the replication under.
1. Click Finish to skip to the end.
1. Give the replication a name.
1. Click finish.

You might get an error that the SQL Agent is not started. Just right-click on the SQL Server Agent and start it.

![SQL Server Agent](/images/sql/sql_server_agent.png)

Now we need to set up a subscription. 

1. Right-click on the publication and choose New Subscriptions&hellip;
1. The New Subscription Wizard will launch.
1. Click next and choose the publication.
1. Click next until you get to the Subscribers page.
1. Choose the SubscriberDatabase.
1. Click next and choose a user to run the distribution agent under.
1. Click Finish to skip to the end.
1. Click Finish.

You would think the Person table would be in the SubscriberDatabase right? Well, we have one more step to go.

1. Right-click the publication.
1. View Snapshot Agent Status.
1. Click Start.

You can click the monitor button to watch the process.

Eventually you will replicate the table to the SubscriberDatabase.

![repl.Person](/images/sql/repl_person.png)

Congratulations, you have now replicated a table from one schema to a different schema.

Don't forget to use the schema name with querying the table.

```sql
USE SubscriberDatabase
SELECT * FROM repl.Person
```