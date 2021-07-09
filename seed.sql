INSERT INTO departments (department)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO roles (title, salary, departments_id)
VALUES  ('Sales Lead', 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2);

INSERT INTO roles (title, salary, departments_id)
VALUES  ('Accountant', 125000, 3),
        ('Legal Team Lead', 250000, 4),
        ('Lawyer', 190000, 4);
        
INSERT INTO employees (first_name, last_name, roles_id, mgr_id, is_mgr)
VALUES  ('Gandalf', 'TheGray', 1, null, true),
        ('Frodo', 'Baggins', 2, 3, false),
        ('Samwise', 'Gamgee', 5, 1, true),
        ('Pippin', 'Took', 7, 3, false);

INSERT INTO employees (first_name, last_name, roles_id, mgr_id, is_mgr)
VALUES  ('Merry', 'Brandybuck', 6, 3, false),
        ('Aragorn', 'Strider', 3, 1, true),
        ('Legolas', 'Greenleaf', 4, 6, false),
        ('Gimli', 'Gloinson', 4, 6, false);