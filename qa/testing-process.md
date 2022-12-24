---
title: "Testing Process"
description: "My testing process based on a lot of books, blogs, and experience"
date: 2016-04-11T00:00:00-00:00
lastmod: 2018-12-05T00:00:00-00:00
activemenu: "testing"
---

# Testing Process

By: Dan Stewart\
April 11, 2016\
[MIT License](https://mit-license.org)

## Overview

My testing process is made up of:

1. **Test** Notes
1. **Test** Basis
1. **Test** Plan
1. **Test** Suite
1. **Test** Case

This is my process, but maybe reading about it will help you too. I'm going to add some humor to make it entertaining. 
At work I'm much more professional.

The test notes are my best friend. They prove that I tested. They show how I tested, and they help me improve my techniques 
as a tester. The test basis is often called the oracle of truth. It is the foundation from which I build my tests. The test 
plan gives me the when, how, and what I will test. The test suite is a collection of test cases that I will perform.

## Test Notes

When someone asks me to test something, the first thing I do is start my notes. I want to write down who asked me to test, 
when I can test, when I will be done, what will be tested, and how I will get paid. These notes can be copied and pasted 
into the test plan later. 

## Test Basis

I prefer calling it the test basis as opposed to the oracle. At my work, Oracle&reg; is software, not a source of truth. I look 
for documentation, statutes, policies, and procedures. Software is written to enforce these policies. When a policy changes, the 
software has to change. When software is changed, testers make sure the change agrees with the new policies. They perform regression 
testing to make sure that existing policies are still enforced.

Sometimes, I get to write the policy because a question arises before the testing begins. The exciting thing about writing a policy is 
that it will outlive the software. I created it based on conversations I had with subject matter experts. I contacted the stakeholders 
and had them agree to the policy. Once they agreed, the developers  enforced it in the software. I discovered a policy, got it approved, 
and saw it in development.

I see policies as the foundation of my testing. If I have a question, I get an answer. Then I document it and test for it. 
I am finding truth. It is very rewarding.

<blockquote class="blockquote">
The truth is rarely pure and never simple.
<footer class="blockquote-footer"> 
Oscar Wilde, [The Importance of Being Earnest](https://www.amazon.com/Importance-Being-Earnest-Oscar-Wilde/dp/1717968007)
</footer>
</blockquote>

Some say, "there is no truth." To them I ask, "is that true?" 

I believe there is truth. If what we thought was true changes, the truth did not change. Truth cannot change or else it would not be true. 
Only our understanding of the truth has changed. When I test, my goal is to reach an acceptable level of truth. That acceptable level 
is dependent upon the time, knowledge, and consequences that a lie would have on others.

## Test Plan

My test plan includes:

* Who hired me?
* What do they expect?
* When can I start?
* When do I stop?
* What do I need to test?
* How do I test it?
* What is my deliverable from the testing?

## Test Suite

I am seeking the truth when I test. Scientists seek truth using the [scientific method](https://en.wikipedia.org/wiki/Scientific_method). 
A test suite asks a *question*. To answer this question a *hypothesis* is formed. Each hypothesis is a test case because a hypothesis can 
be either proven or disproven. Testers *predict* that the software will fail. They go in with the belief that the software will not work 
so that they are looking for the way it will fail. It is a state of mind. The *testing* begins. *Observations* are made and carefully recorded. 
*Experiments* are conducted and scripted so that the results are repeatable. An *analysis* is made to reveal the answer to the question. 
The hypothesis is proven or disproven. Another question is formed and the process begins again.

Let me show you.

### Shack Data Entry

(Link to the test basis)

Administrators need to enter data on a shack. Some of the data is required. Some of the data is validated. If these validations are broken, data 
corruption can occur. Shacks could be built without roofs. Renters could move into a shack without a front door. Panic, riots, unicorns dancing 
in the street. Is the data entry form working correctly?

Preconditions

* The shack data entry software must be running.
* The administrator must have privileges to create, read, update, and/or delete a shack entry.

Required fields:

* Shack ID
* Address
* City
* State
* Zip
* Secure Door (Y/N)
* Roof Materials
* Wall Materials
* Floor Materials

Validated Fields

* Roof, wall, and floor materials must be a value in the Material table. Anything else would be uncivilized.
* Builder email must be validated using an email address regular expression pattern. We do not need to actually validate that it is correct.
* Builder phone must be 10 digits. Non-numeric data should be accepted but not saved to the database. (303) 555-1212 becomes 3035551212 in the database.

State Transition Testing

The life of a form is created, read-only, updated, and deleted (CRUD).

The form has two states, valid and invalid. The form should be saved when valid and not 
saved when invalid. Invalid forms can be made valid and saved.

Decision Table Testing

| Description | State |
|-------------|-------|
| Empty form | Invalid |
| Missing required field | Invalid |
| Invalid field | Invalid |
| Invalid form made valid | Valid |
| Minimum required fields | Valid |
| All fields with valid data | Valid |

Additional Testing

After saving the form, run this query to validate the data.

```sql
SELECT *
FROM Shack
WHERE Address = '[The address entered]'
```

Questions for the stakeholders

I was able to save the same form twice. Should there be validation on duplicates?

## Test Case

A test case should only have one reason to fail. In the test suite above, there are a lot of test cases. Do we need to write each one? 
I tried it once and spent so much time writing test cases I never tested.

Automation to the rescue? I certainly believe we can automate data entry forms. Then we can verify that the form did not save when empty 
and did save when filled out. How do we automate that the labels are spelled correctly? Are the required fields indicated in some way? 
There are some test cases that can be 100% automated, others only 50% and some not at all.

I rely on the test suite to provide test cases in the form of state diagrams and decision tables. I do not want to write all of the test cases.

I use testing mnemonics and heuristics like:

* [San Francisco Depot](http://www.satisfice.com/articles/sfdpo.shtml) 
* [HICCUPPS](http://www.developsense.com/blog/2012/07/few-hiccupps/) 
* [Garbage in, garbage out](https://searchsoftwarequality.techtarget.com/definition/garbage-in-garbage-out)
* [Positive, Negative, Zero, and NULL](https://www.softwaretestinghelp.com/what-is-negative-testing/)
* [CRUD](https://softsmith-testing.blogspot.com/2012/08/the-crud-approach.html)

## Bug Reporting

The purpose of testing is to find bugs. Follow the [Grice Maxims](https://www.sas.upenn.edu/~haroldfs/dravling/grice.html) when you find a bug.

1. *Quantity*, the bug report title should give only enough information as needed. For example, "The website does not automatically redirect to HTTPS."
1. *Quality*, it must be truthful and provide evidence. Screenshots, videos, and reproducible steps provide the evidence needed to confirm that the bug is real.
1. *Relation*, answer why the bug is relevant. Why should the business care? Let's add a relevant sentence to our earlier example, "This leaves visitor data exposed. Modern browsers will warn them that the site is not secure."
1. *Manner*, keep the bug report clear, brief, and orderly. This one takes experience. A mentor can help you review your report before submitting it to the business. Know your audience. If the report is for developers, it can be more technical. If it's for business stakeholders, hold off on the SQL statements.

## Conclusion

Let me close with this. I will write notes, basis, plans, and suites. I will code test cases or perform them manually. Writing test cases is tedious, 
hard to maintain, and not of much value. I prefer to lean on my ability to test instead of documenting every possible test case. To illustrate this 
point, here are some test cases for this form. I believe these should be in the mind of an experienced tester. I’m sure I am missing some. 
The more experience I get testing, the longer this list will become.

1. The user does not have privileges to create, read, update, or delete a form.
1. The user does have privileges to create and read a form, but not update or delete it.
1. The user does have privileges to read a form but not create, update, or delete it.
1. The user does have privileges to read and update a form but not create or delete it.
1. The user does have privileges to create, read, update, and delete a form.
1. The user creates a form. It should be blank or have some default values. 
1. The labels should be spelled correctly.
1. Required fields should be indicated.
1. Does the form need to be translated into another language? This opens the door to a lot of localization tests.
1. The labels should be styled consistently. Bolded? Colon at end? On top of field? On left of field?
1. The fields should be of the right type. Textboxes, dropdowns, date pickers, numeric, etc.
1. The fields should handle the correct amount of input. Everything from a two letter state code to a 2 GB file upload.
1. Explanation text should be spelled correctly and consistently styled.
1. There should be some way to save the form.
1. There should be some way to exit the form without saving.
1. There should be some way to get help on the form.
1. The form questions should be clearly understood.
1. The order of the fields should be logical.
1. The tab order should flow top down and left to right.
1. The form should be scaled or allow scaling. This is for mobile devices or by vision impaired users.
1. When a form is created, are all fields blank or should there be default values?
1. Saving a blank form should result in a required field error.
1. The required fields error should be understandable, spelled correctly, and consistently styled.
1. Address is required, so leave it blank but fill in all other required fields with valid data. The error message should point out the field 
that is required. Repeat this for all required fields one at a time.
1. Email is validated, so fill it with invalid data and fill in all other required fields with valid data. The error message should point out 
the field that is invalid. Repeat this for all validated fields one at a time.
1. Validation patterns can be buggy. Research the pattern and see what valid inputs are being incorrectly reported. 
1. If validation is done client-side, disable JavaScript and submit the form. The invalid input should not be saved to the database.
1. Create and submit a form with the least amount of completed fields possible. Check the database to make sure the values were saved 
correctly. There might be other fields such as create date in the table that needs to be validated.
1. Create and submit a form with all of the fields possible. Check the database to make sure the values were saved correctly.
1. Submit the exact same form again. This will add a duplicate record in the database. Does the form allow that? If it does, look down the 
line where having a duplicate record would be a problem.
1. Read-only forms should not allow updating or deleting.
1. Check the database and look for invalid data that already exists. Open these forms in read-only mode. Did you get a null reference exception? 
Do you fix the old, bad data or ask to check for nulls in the form?
1. Edit a form and remove required fields. The form should not be allowed to save and an error message should be displayed.
1. Edit a form and invalidate the fields. The form should not be allowed to save and an error message should be displayed.
1. Edit the form that had the least amount of data. Update every required field and submit it. Check the database to make sure the values were saved correctly.
1. Edit the form with all of the fields and submit it. Check the database to make sure the values were saved correctly.
1. Delete a form. Where did you end up? Is there an undelete or a confirmation?
1. Delete all of the forms. Did you get a null reference exception when the list of forms is displayed?