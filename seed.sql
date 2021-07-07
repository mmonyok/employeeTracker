INSERT INTO department (department)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES  ('Sales Lead', 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUES  ('Accountant', 125000, 3),
        ('Legal Team Lead', 250000, 4),
        ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ('Gandalf', 'TheGray', 1),
        ('Frodo', 'Baggins', 2),
        ('Samwise', 'Gamgee', 5),
        ('Pippin', 'Took', 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ('Merry', 'Brandybuck', 6),
        ('Aragorn', 'Strider', 3),
        ('Legolas', 'Greenleaf', 4),
        ('Gimli', 'Gloinson', 4);