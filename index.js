// ask about default for init() switch statement.
// Why can't i have a separate connection.js file with raw sql instead of only with sequelize.
// need to make sure salary is entered as a number with no commas.
// ask about inner joins instead of left or right joins.
// Difference between rawlist and list.
// If department is null how do i get it to show up in the list as "none",

const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');

// This is all the code for connecting to the MySQL database.
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        throw Error(err);
    };
    console.log(`connected as id ${connection.threadId}`);
    init();
});

function viewAllEmployees() {
    connection.query('SELECT id, first_name, last_name, title, department, salary FROM employees LEFT JOIN roles ON employees.roles_id = roles.r_id LEFT JOIN departments ON roles.departments_id = departments.d_id;', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

function viewEmployeeByDpt() {
    connection.query('SELECT * FROM departments;', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "Which department's employees would you like to view?",
                choices: res.map((response) => response.department),
                name: 'viewDpt',
            }
        ]).then(res => {
            const dpt = res.viewDpt;
            connection.query(`SELECT id, first_name, last_name, title, salary FROM employees INNER JOIN roles ON employees.roles_id = roles.r_id INNER JOIN departments ON roles.departments_id = departments.d_id WHERE departments.department = '${dpt}';`, (err, res) => {
                if (err) throw err;
                console.table(res);
                init();
            });
        });
    });
};

function viewEmployeeByRole() {
    connection.query('SELECT * FROM roles;', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                message: "Which Role would you like to view?",
                choices: res.map((response) => response.title),
                name: 'viewRole',
            }
        ]).then(res => {
            const role = res.viewRole;
            connection.query(`SELECT id, first_name, last_name, salary, department FROM employees INNER JOIN roles ON employees.roles_id = roles.r_id INNER JOIN departments ON roles.departments_id = departments.d_id WHERE roles.title = '${role}';`, (err, res) => {
                if (err) throw err;
                console.table(res);
                init();
            });
        });
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            message: "What is the name of the new department?",
            name: 'dptName',
        }
    ]).then(res => {
        connection.query(`INSERT INTO departments (department) VALUES ('${res.dptName}');`, (err, res) => {
            if (err) throw err;
            console.log(`Added ${res.dptName} as a new department.`);
            init();
        });
    })
}

function deleteDepartment() {
    connection.query('SELECT * FROM departments;', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "What is the name of the department you would like to delete?",
                choices: res.map((response) => response.department),
                name: 'delDpt',
            }
        ]).then(data => {
            let deleted = data.delDpt;
            connection.query(`DELETE FROM departments WHERE department = '${deleted}';`, (err, res) => {
                if (err) throw err;

                console.log(chalk.black.bgRed(`Deleted ${deleted} from the departments database.`));
                init();
            });
        });
    });
};

function addRole() {
    connection.query('SELECT * FROM departments;', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                message: "What is the title of the role?",
                name: 'roleTitle',
            },
            {
                message: "What is the salary for this role?",
                name: 'roleSalary',
            },
            {
                type: 'list',
                message: "Please select the department for this role.",
                choices: res.map((response) => response.department),
                name: 'roleDpt',
            }
        ]).then(res => {
            let title = res.roleTitle;
            let salary = res.roleSalary;
            connection.query(`SELECT d_id FROM departments WHERE department = '${res.roleDpt}';`, (err, res) => {
                if (err) throw err;
                connection.query(`INSERT INTO roles (title, salary, departments_id) VALUES ('${title}', '${salary}', ${res[0].d_id});`, (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${title} as a new role.`);
                    init();
                });
            });
        });
    });
};

function deleteRole() {
    connection.query('SELECT * FROM roles;', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "What is the name of the role you would like to delete?",
                choices: res.map((response) => response.title),
                name: 'delRole',
            }
        ]).then(data => {
            let deleted = data.delRole;
            connection.query(`DELETE FROM roles WHERE title = '${deleted}';`, (err, res) => {
                if (err) throw err;

                console.log(chalk.black.bgRed(`Deleted ${deleted} from the roles database.`));
                init();
            });
        });
    });
};

function addEmployee() {
    connection.query('SELECT * FROM roles;', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                message: "What is the employee's first name?",
                name: 'firstName',
            },
            {
                message: "What is the employee's last name?",
                name: 'lastName',
            },
            {
                type: 'list',
                message: "What is the employee's role?",
                choices: res.map((response) => response.title),
                name: 'empRoles',
            },
        ]).then(res => {
            let fName = res.firstName;
            let lName = res.lastName;
            connection.query(`SELECT r_id FROM roles WHERE title = '${res.empRoles}';`, (err, res) => {
                if (err) throw err;
                connection.query(`INSERT INTO employees (first_name, last_name, roles_id) VALUES ('${fName}', '${lName}', ${res[0].r_id});`, (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${fName} ${lName} as a new employee.`);
                    init();
                });
            });
        });
    });
};

function deleteEmployee() {
    connection.query('SELECT * FROM employees;', (err, employees) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee would you like to delete?",
                choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
                name: 'delEmp',
            },
        ]).then(data => {
            let empFirst = data.delEmp.split(" ")[0];
            let empLast = data.delEmp.split(" ")[1];

            connection.query(`DELETE FROM employees WHERE first_name = '${empFirst}' AND last_name = '${empLast}';`, (err, res) => {
                if (err) throw err;
                console.log(chalk.black.bgRed(`Deleted employee, ${data.delEmp}, from the database.`));
                init();
            });
        });
    });
};

function updateRole() {
    connection.query('SELECT * FROM roles;', (err, roles) => {
        connection.query('SELECT * FROM employees;', (err, employees) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's role do you want to update?",
                    choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
                    name: 'updateRole',
                },
                {
                    type: 'list',
                    message: "Please select the new role for this employee.",
                    choices: roles.map((response) => response.title),
                    name: 'chooseRole',
                }
            ]).then(data => {
                let empFirst = data.updateRole.split(" ")[0];
                let empLast = data.updateRole.split(" ")[1];
                connection.query(`SELECT r_id FROM roles WHERE title = '${data.chooseRole}';`, (err, res) => {
                    if (err) throw err;

                    connection.query(`UPDATE employees SET roles_id = ${res[0].r_id} WHERE first_name = '${empFirst}' AND last_name = '${empLast}';`, (err, res) => {
                        if (err) throw err;
                        console.log(`Updated ${data.updateRole}'s role to ${data.chooseRole}.`);
                        init();
                    });
                });
            });
        });
    });
};

function init() {
    inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Role', 'Add Department', 'Delete Department', 'Add Role', 'Delete Role', 'Add Employee', 'Delete Employee', 'Update Employee Role', 'Quit'],
            name: 'menuChoice',
        }
    ]).then(res => {
        switch (res.menuChoice) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Employees By Department':
                viewEmployeeByDpt();
                break;
            case 'View All Employees By Role':
                viewEmployeeByRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'Quit':
            case 'Default':
                connection.end();
        };
    });
};