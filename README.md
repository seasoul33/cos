# COS
Circle of Safety system

It is used to build a circle of safety in a team/department/company to improve the group's inner culture.

Inspired by the following person/organization:
* Simon Sinek
* Google

Currently it supports:

1. Upward grading to give a grade and/or comment to leaders in the group.
2. Calculating the grade result and annouce through mail.
3. Simple account management.

Planed to support:

1. Horizontal grading to colleagues in the group.
2. Topics forum(?)
3. Any thing help to build the circle of safety.

Database: Postgres 9.5.3

Please be noted that:

1. Install Postgresql before 'npm install'.
2. Replace the postgresql username/password with your own.
3. Replace the username/password with your own to access smtp server.
4. Insert question data into database.(table 'xxx_question').
