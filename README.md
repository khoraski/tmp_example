Running this program requires the host machine to have MySQL installed and running.

The server accesses the table using a username, password, and database name.
These appropriate values can be found in the file "sql_global.js", and can be altered to suit your platform if need be. 

The default database name is "euclid". 

Create that database like so:

CREATE DATABASE euclid;
USE euclid;

After the database is created, add the appropriate tables to it with these commands in MySQL:

CREATE TABLE USERS (id int, name varchar(32), created date, hash varchar(256) );
CREATE TABLE PROJECTS (id int, name varchar(32), created date, author int);
CREATE TABLE PROJECT_DATA (id int, line_no int, data varchar(256));

NodeJS and NPM must be installed as well, as well as several packages, including the MySQL and Express packages. 

After all appropriate packages have been installed, you can start the server with "./start".

The server is started on localhost:3000.


