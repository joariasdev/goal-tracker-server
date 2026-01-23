# Database Schema

## Entities

Users:

- id
- first_name
- last_name
- email
- password_hash

Goals:

- id
- title
- description
- is_completed
- user_id

## SQL Queries

```
CREATE DATABASE IF NOT EXISTS goal_tracker_db;

DROP TABLE IF EXISTS  goals;
DROP TABLE IF EXISTS  users;

CREATE TABLE users(
id SERIAL PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE goals(
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description VARCHAR(255),
is_completed BOOL DEFAULT false,
user_id INT REFERENCES users(id)
);
```
