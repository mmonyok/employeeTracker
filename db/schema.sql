DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE departments (
	d_id INT NOT NULL AUTO_INCREMENT,
	department VARCHAR(30),
    PRIMARY KEY(d_id)
);

CREATE TABLE roles (
	r_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary INT,
    departments_id INT,
	PRIMARY KEY(r_id)
);

CREATE TABLE employees (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INT,
	mgr_id INT,
    is_mgr BOOLEAN DEFAULT false,
	PRIMARY KEY(id)
);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;

SELECT SUM(r.salary) AS Total_Budget FROM roles AS r WHERE r.departments_id = 2;

SELECT d.department AS Department, SUM(r.salary) AS Total_Budget FROM roles AS r LEFT JOIN departments AS d ON r.departments_id = d.d_id GROUP BY department ORDER BY Total_Budget DESC;

SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager
FROM employees AS e
WHERE e.is_mgr = true;

SELECT e1.id, e1.first_name, e1.last_name, r.title, d.department, r.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager
FROM employees AS e1
LEFT JOIN employees AS e2
ON e1.mgr_id = e2.id
LEFT JOIN roles AS r
ON e1.roles_id = r.r_id
LEFT JOIN departments AS d
ON r.departments_id = d.d_id;