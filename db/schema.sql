DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
	d_id INT NOT NULL AUTO_INCREMENT,
	department VARCHAR(30),
    PRIMARY KEY(d_id)
);

CREATE TABLE role (
	r_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary INT,
    department_id INT,
	PRIMARY KEY(r_id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
	PRIMARY KEY(id)
);