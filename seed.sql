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
        
-- INSERT INTO employees (first_name, last_name, roles_id, manager, mgr_id)
-- VALUES  ('Gandalf', 'TheGray', 1, null, null),
--         ('Frodo', 'Baggins', 2, 'Frodo Baggins', 3),
--         ('Samwise', 'Gamgee', 5, 1),
--         ('Pippin', 'Took', 7, 3);

-- INSERT INTO employees (first_name, last_name, roles_id, mgr_id)
-- VALUES  ('Merry', 'Brandybuck', 6, 3),
--         ('Aragorn', 'Strider', 3, 1),
--         ('Legolas', 'Greenleaf', 4, 6),
--         ('Gimli', 'Gloinson', 4, 6);

INSERT INTO employees (first_name, last_name, roles_id, manager, mgr_id)
VALUES  ('Gandalf', 'TheGray', 1, 'Gandalf TheGray', null),
        ('Frodo', 'Baggins', 2, 'Frodo Baggins', 3),
        ('Samwise', 'Gamgee', 5, 'Samwise Gamgee', 1),
        ('Pippin', 'Took', 7, 'Pippin Took', 3);

INSERT INTO employees (first_name, last_name, roles_id, mgr_id)
VALUES  ('Merry', 'Brandybuck', 6, 'Merry Brandybuck', 3),
        ('Aragorn', 'Strider', 3, 'Aragorn Strider', 1),
        ('Legolas', 'Greenleaf', 4, 'Legolas Greenleaf', 6),
        ('Gimli', 'Gloinson', 4, 'Gimli Gloinson', 6);