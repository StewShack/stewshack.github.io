---
title: "Testing a Column Length Change"
description: "Things to test for when a column length changes"
date: 2015-01-09T00:00:00-00:00
lastmod: 2015-01-09T00:00:00-00:00
activemenu: "testing"
---

# Testing a Column Length Change

By: Dan Stewart\
January 9, 2015\
[MIT License](https://mit-license.org)

You work as a tester for Spacely's Space Sprockets. Customers are complaining that they cannot enter their address.

The developers think the problem is that address line 1 only allows 50 characters, and customers are entering addresses longer than that.

Mr. Spacely has authorized the length of the address field be increased to 200 characters. How do you test it?

First, validate the solution by talking to customers. Is 200 characters enough? Gather some real-world examples. What are some addresses 
that are exceeding the limit?

After looking at examples it is decided that 200 is plenty of room for an address.

Here is a Microsoft SQL database query to find all columns in the database like "address".

```sql
SELECT c.Table_Name, c.Column_Name, c.Data_Type, c.Character_Maximum_Length
FROM Information_Schema.Columns c
JOIN Information_Schema.Tables t ON t.Table_Name = c.Table_Name
WHERE c.Column_Name LIKE '%address%'
   AND t.Table_Type = 'BASE TABLE'
ORDER BY c.Table_Name, c.Column_Name
```

You remove the false positives like EmailAddress from your results and end up with:

| Table Name | Column Name | Data Type | Character Maximum Length |
|------------|-------------|-----------|--------------------------:|
| Address | Address1 | varchar | 50 |
| Address | Address2 | varchar | 50 |
| ShoppingCartSprocket | MailToAddress1 | varchar | 50 |
| ShoppingCartSprocket | MailToAddress2 | varchar | 50 |
| VipCorporateCustomer | Address1 | varchar | 50 |
| VipCorporateCustomer | Address2 | varchar | 50 |
| SalesReceipt | ShipAddress1 | varchar | 50 |
| SalesReceipt | ShipAddress2 | varchar | 50 |

Increasing line 1 of the Address table might not be enough of a change. What about line 2? It also looks like the shopping cart is affected. 
If anything this list has highlighted some additional places to ask developers about and test later.

You can run the same query again to verify that the change was made.

Finally, look at the source code. Be on alert for where the address is added to something else. For example, you notice that the address is 
put into an email to the shipping clerk. "We just shipped a Sprocket to [Address1]." This field is then saved into the database as 
"ShippingClerkEmailSubject". The column length is only 81 characters ('We just shipped a Sprocket to' + 50 + '.' = 81). A longer Address1 
field will cause errors saving the email.

Database column changes have a ripple effect. Do your best in trying to follow the ripples to all the areas affected.

Now that you have done the research, you know to test the database, registration, shopping cart, shipping clerk emails&hellip;

