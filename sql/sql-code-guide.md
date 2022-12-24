---
title: "SQL Code Style Guide"
description: "How I style my SQL code"
date: 2016-02-10T00:00:00-00:00
lastmod: 2016-02-10T00:00:00-00:00
activemenu: "web"
---

# SQL Code Style Guide

By: Dan Stewart\
February 10, 2016\
[MIT License](https://mit-license.org/)

Standards were meant to be broken. This is not a standard. This is how I like to write SQL code. Feel free to deviate when needed. 

## Source Code File Organization

Source code files should contain only one SQL object definition with the file name being the same name as the object name. For example, 
if the object name is spShackListingByID the file name would be spShackListingByID.sql.

## Stored Procedures

```sql
CREATE PROCEDURE spShackListingByID
(
  Param1,
  Param2
)

AS

Query

GO
```

## Indentation

Spaces, not tabs. Tabs are measured differently by different editors, but spaces are uniform.

## Commas

Commas go at the end of a line except if used in a method.

```sql
SELECT s.ShackID AS [ID],
  Name AS [Shack Name]
```

Method commas do not need to be on their own line.

```sql
REPLACE(
  REPLACE(
    CAST(@LineBreaksInTextField AS VARCHAR(MAX)), CHAR(13), ' '), CHAR(10), ' ')
```

## Line Length

Break up lines as needed to avoid horizontal scrolling. The section on Wrapping Lines will help.

```sql
REPLACE(REPLACE(CAST(@LineBreaksInTextField AS VARCHAR(MAX)), CHAR(13), ' '), CHAR(10), ' ')

--If it is too long, break on a comma.

REPLACE(REPLACE(CAST(@LineBreaksInTextField AS VARCHAR(MAX)), 
  CHAR(13), ' '), 
  CHAR(10), ' ')
```

## Wrapping Lines

New line general principles:

1. Break after a comma
1. Break at the end of SELECT statement
1. Break at the end of CASE
1. Break at the end of WHEN THEN statement
1. Break at the end of ELSE statement
1. Break at the end of FROM statement
1. Break at the end of JOIN statement
1. Break at the end of WHERE statement
1. Break at the end of AND/OR statement
1. Break at the end of ORDER BY statement
1. Break at the end of GROUP BY statement
1. Break at the end of HAVING statement

## Wrapping Lines Example

```sql
SELECT COUNT(s.ShackID),
  CASE 
    WHEN s.HasWater = 1 THEN 'Move in ready'
    ELSE 'Fix er upper'
  END as [Good Shack],
  o.Name
FROM Shack s
  JOIN Renter r ON r.RenterID = s.RenterID
    AND r.Type = 'Human'
WHERE s.ZipCode = '80112'
GROUP BY s.HasWater,
  r.Name
HAVING COUNT(s.ShackID) > 1
```

## Comments

The comments I usually see involve explaining variables and why they have the value they do.

SQL queries can have two kinds of comments: block comments and line comments. Block comments 
are delimited by /*...*/, and line comments are --.

Avoid adding comments at the end of a line of code. Here be dragons...

```sql
UPDATE Shack SET HasWater = 1 -- Yeah water! WHERE ShackID = 5
```

Because the comment was added on the same line as the code, the WHERE clause was commented out. 
Now all of the shacks have water instead of just the one with ID = 5. I've seen this happen. It's not fun.

Avoid surrounding a block comment with a frame. It may look nice, but it is hard to maintain.

```sql
/* ()xxxx{:::::::::::::::::::::::::
If you add anything to this comment,
you have to lengthen the swords.
()===[]{::::::::::::::::::::::::::: */
```

Comments can create zombie code. This is dead code, but if you check it in, it will live an undead existence. 
Remove zombie code before you check in.

```sql
SELECT *
FROM Shack
WHERE Zip = '80112'
-- AND OccupantType = 'Zombie'
```

## Declarations

One declaration per line is recommended.

```sql
DECLARE @ShackID INT,
  @OccupantType VARCHAR(25),
  @HasWater BIT
```

Put variables only at the beginning of the query.

```sql
CREATE PROCEDURE spShackListings
(
  @OccupantType VARCHAR(25),
  @HasWater BIT
)

AS

DECLARE @StartDate DATETIME,
  @EndDate DATETIME

SET @StartDate = GETDATE() - 1
SET @EndDate = GETDATE()
```

## White Space

### Blank Lines

Blank lines go:

* Before the SELECT in a stored procedure
* Before and after a UNION
* Before and after the GO
* Before and after a block comment
* Before and after declaring local variables
* Before and after setting all of the local variables

Blank spaces go:

* After a comma
* Before and after an operator (= + - * /)

## Naming Rules

There are only two hard problems in computer science.

1. Naming things
1. Cache invalidation
1. Off-by-one errors

Don't get stuck in analysis paralysis with names. Name the object the first thing that comes to mind and change it later.

## Objects

* Objects such as stored procedures start with "sp".
* Contain no special characters such as an underscore.
* Are camel cased such as spShackListings.

## Naming Variables

* Do not use Hungarian notation for variable names.
* Start with the function name if needed. For example: AvgShackRating, SumRenterShacks, MinMoveInDate, or MaxMoveOutDate.
* Use opposites in variable names, such as Start/End.
* Collections should be named as the plural form of the singular objects that the collection contains. A collection of Shack objects is named Shacks.
* Boolean variable should imply Yes/No; True/False values, such as @HasWater, @IsFallingApart, or @ContainsAsbestos.

## Tables

* When naming tables, express the name in the singular form. For example, use Shack instead of Shacks.
* When naming columns of tables, do not repeat the table name except for the primary key, for example, if the table is Shack, 
the primary key is ShackID. The other columns should not be named ShackName or ShackHasWater.

## Microsoft SQL Server

* Do not prefix stored procedures with sp_, because this prefix is reserved for identifying system-stored procedures.
* In Transact-SQL, do not prefix variables with @@, because they should be used for variables such as @@IDENTITY.

## Capitalization

Pascal case - The first letter and the first letter of each word are capitalized. For example: HasWater.

Camel case - The first letter of an identifier is lowercase and the first letter of each subsequent concatenated word is capitalized. 
For example: spShackListings.

All Caps - All letters in the identifier are capitalized. For example: SELECT

The following table provides rules and example for common identifiers:

| Identifier Type | Rules for Naming | Examples |
|-----------------|------------------|----------|
| SQL | All Caps | SELECT FROM WHERE |
| TSQL Functions | All Caps | GETDATE() MIN() MAX() |
| Objects | Pascal case | HasWater |
| Stored Procedures | Camel case | spShackListings |

## Common Functions

### Date Ranges

```sql
CREATE PROCEDURE spShackMoveInDates
(
  @StartDate DATETIME,
  @EndDate DATETIME
)

AS

SET @StartDate = DATEADD(DAY, DATEDIFF(DAY, 0, @StartDate), 0)
SET @EndDate = DATEADD(DAY, 1, DATEADD(DAY, DATEDIFF(DAY, 0, @EndDate), 0))

SELECT *
FROM Shack
WHERE MoveInDate &gt;= @StartDate AND MoveInDate &lt; @EndDate

GO
```

### Multiple Values

```sql
DECLARE @LastNames VARCHAR(MAX),
  @RemainingLastNames NVARCHAR(MAX),
  @CommaIndex INT,
  @LastName NVARCHAR(250)

DECLARE @LastNameTable TABLE (LastName VARCHAR(250))

SET @LastNames = 'Stewart,Stuart'
SET @RemainingLastNames = @LastNames
SET @CommaIndex = CHARINDEX(',', @RemainingLastNames)

WHILE (LEN(@RemainingLastNames) &gt; 0) BEGIN
  IF @CommaIndex &gt; 0 BEGIN
    SET @LastName = LEFT(@RemainingLastNames, @CommaIndex - 1)
  END
  ELSE BEGIN
    SET @LastName = @RemainingLastNames
  END

  INSERT INTO @LastNameTable (LastName) VALUES (RTRIM(LTRIM(@LastName)))

  IF @CommaIndex &gt; 0 BEGIN
    SET @RemainingLastNames = RIGHT(@RemainingLastNames, LEN(@RemainingLastNames) - @CommaIndex)
  END
  ELSE BEGIN
    SET @RemainingLastNames = ''
  END

  SET @CommaIndex = CHARINDEX(',', @RemainingLastNames)
END

SELECT *
FROM Renter r
  JOIN @LastNameTable t ON t.LastName = r.LastName
```

### Best, Latest

Find the latest shack rented for each renter.

```sql
SELECT r.MoveInDate,
  s.Name
FROM Shack s
  JOIN Renter r ON r.RenterID = s.RenterID
  JOIN (
    SELECT ROW_NUMBER() OVER (PARTITION BY r.RenterID ORDER BY s.MoveInDate DESC) AS Ordinal,
      s.ShackID
    FROM Shack s
      JOIN Renter r ON r.RenterID = s.RenterID) LastShackRented ON LastShackRented.ShackID = s.ShackID
        AND LastShackRented.Ordinal = 1
    WHERE s.MoveInDate &gt; '1/1/2016'
ORDER BY s.MoveInDate
```

### Concatenating into a Single Column for Custom Data

```sql
SELECT (SELECT ISNULL(r.FirstName, '') + ISNULL(r.Name, '') AS [data()]
FROM Renter r
  JOIN Shack s ON s.RenterID = r.RenterID
WHERE r.RenterID = rn.RenterID
FOR XML PATH('')) AS [Custom Info]
  FROM Renter rn
  WHERE rn.RenterID = 123
```