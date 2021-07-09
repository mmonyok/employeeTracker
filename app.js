// need to make sure salary is entered as a number with no commas.

const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');
require('console.table');
require('dotenv').config();

// These are shortcuts for the text art.
let white = chalk.white.bold;
let cyan = chalk.cyan.bold;

// This is all the code for connecting to the MySQL database.
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

// The following functions allow you to view employees by different parameters.
function viewAllEmployees() {
    connection.query("SELECT e1.id, e1.first_name, e1.last_name, r.title, d.department, r.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager    FROM employees AS e1 LEFT JOIN employees AS e2 ON e1.mgr_id = e2.id LEFT JOIN roles AS r ON e1.roles_id = r.r_id LEFT JOIN departments AS d ON r.departments_id = d.d_id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
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
            connection.query(`SELECT id, first_name, last_name, title, salary FROM employees LEFT JOIN roles ON employees.roles_id = roles.r_id LEFT JOIN departments ON roles.departments_id = departments.d_id WHERE departments.department = '${res.viewDpt}';`, (err, res) => {
                if (err) throw err;
                console.table(res);
                menu();
            });
        });
    });
};

function viewEmployeeByMgr() {
    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager, e.id FROM employees AS e WHERE e.is_mgr = true;", (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "Which manager's employees would you like to view?",
                choices: res.map((response) => {
                    return {
                        name: response.manager,
                        value: response.id
                    }
                }),
                name: 'mgrName',
            }
        ]).then(res => {
            connection.query(`SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, r.title, d.department, r.salary FROM employees AS e LEFT JOIN roles AS r ON e.roles_id = r.r_id LEFT JOIN departments AS d ON r.departments_id = d.d_id WHERE e.mgr_id = ${res.mgrName};`, (err, res) => {
                if (err) throw err;
                console.table(res);
                menu();
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
            connection.query(`SELECT id, first_name, last_name, salary, department FROM employees LEFT JOIN roles ON employees.roles_id = roles.r_id LEFT JOIN departments ON roles.departments_id = departments.d_id WHERE roles.title = '${res.viewRole}';`, (err, res) => {
                if (err) throw err;
                console.table(res);
                menu();
            });
        });
    });
};

// This function allows you to see all departments' budgets based on total cost of employees in that department.
function viewDepartmentBudget() {
    connection.query('SELECT d.department AS Department, SUM(r.salary) AS Total_Budget FROM roles AS r LEFT JOIN departments AS d ON r.departments_id = d.d_id GROUP BY department ORDER BY Total_Budget DESC;', (err, res) => {
        if (err) throw err;
        console.log(res);
        console.table(res);
        menu();
    });
};

// The following functions allow you to add to your database (departments, roles, and employees).
function addDepartment() {
    inquirer.prompt([
        {
            message: "What is the name of the new department?",
            name: 'dptName',
        }
    ]).then(data => {
        connection.query(`INSERT INTO departments (department) VALUES ('${data.dptName}');`, (err, res) => {
            if (err) throw err;
            console.log(chalk.black.bgGreen(`Added ${data.dptName} as a new department.`));
            menu();
        });
    })
}

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
                choices: res.map((response) => {
                    return {
                        name: response.department,
                        value: response.d_id,
                    }
                }),
                name: 'roleDpt',
            }
        ]).then(data => {
            connection.query(`INSERT INTO roles (title, salary, departments_id) VALUES ('${data.roleTitle}', '${data.roleSalary}', ${data.roleDpt});`, (err, res) => {
                if (err) throw err;
                console.log(chalk.black.bgGreen(`Added ${data.roleTitle} as a new role.`));
                menu();
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
                choices: res.map((response) => {
                    return {
                        name: response.title,
                        value: response.r_id
                    }
                }),
                name: 'empRoles',
            },
        ]).then(data => {
            connection.query(`INSERT INTO employees (first_name, last_name, roles_id) VALUES ('${data.firstName}', '${data.lastName}', ${data.empRoles});`, (err, res) => {
                if (err) throw err;
                console.log(chalk.black.bgGreen(`Added ${data.firstName} ${data.lastName} as a new employee.`));
                menu();
            });
        });
    });
};

// The following functions allow you to delete from your database (departments, roles, and employees).
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
            connection.query(`DELETE FROM departments WHERE department = '${data.delDpt}';`, (err, res) => {
                if (err) throw err;

                console.log(chalk.black.bgRed(`Deleted ${data.delDpt} from departments.`));
                menu();
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
            connection.query(`DELETE FROM roles WHERE title = '${data.delRole}';`, (err, res) => {
                if (err) throw err;

                console.log(chalk.black.bgRed(`Deleted ${data.delRole} from roles.`));
                menu();
            });
        });
    });
};

function deleteEmployee() {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees;", (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee would you like to delete?",
                choices: res.map((response) => {
                    return {
                        name: response.name,
                        value: {
                            id: response.id,
                            name: response.name
                        }
                    }
                }),
                name: 'delEmp',
            },
        ]).then(data => {
            connection.query(`DELETE FROM employees WHERE id = ${data.delEmp.id};`, (err, res) => {
                if (err) throw err;
                console.log(chalk.black.bgRed(`Deleted employee, ${data.delEmp.name}, from the database.`));
                menu();
            });
        });
    });
};

// The following functions allow you to update your employee's roles or managers.
function updateManager() {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees;", (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's manager do you want to update?",
                choices: res.map((response) => {
                    return {
                        name: response.name,
                        value: {
                            id: response.id,
                            name: response.name
                        }
                    }
                }),
                name: 'updateEmp',
            },
            {
                type: 'list',
                message: "Who should be assigned as your employee's new manager?",
                choices: res.map((response) => {
                    return {
                        name: response.name,
                        value: {
                            id: response.id,
                            name: response.name
                        }
                    }
                }),
                name: 'updateMgr',
            }
        ]).then(data => {
            connection.query(`UPDATE employees SET mgr_id = ${data.updateMgr.id} WHERE id = ${data.updateEmp.id};`, (err, res) => {
                connection.query(`UPDATE employees SET is_mgr = true WHERE is_mgr = false AND id = ${data.updateMgr.id};`, (err, res) => {
                    if (err) throw err;
                    console.log(chalk.black.bgCyan(`Updated ${data.updateEmp.name}'s manager to ${data.updateMgr.name}.`));
                    menu();
                });
            });
        });
    });
};

function updateRole() {
    connection.query('SELECT * FROM roles;', (err, roles) => {
        connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees;", (err, emp) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's role do you want to update?",
                    choices: emp.map((response) => {
                        return {
                            name: response.name,
                            value: {
                                id: response.id,
                                name: response.name
                            }
                        }
                    }),
                    name: 'updateRole',
                },
                {
                    type: 'list',
                    message: "Please select the new role for this employee.",
                    choices: roles.map((response) => {
                        return {
                            name: response.title,
                            value: {
                                id: response.r_id,
                                title: response.title
                            }
                        }
                    }),
                    name: 'chooseRole',
                }
            ]).then(data => {
                connection.query(`UPDATE employees SET roles_id = ${data.chooseRole.id} WHERE id = ${data.updateRole.id};`, (err, res) => {
                    if (err) throw err;
                    console.log(chalk.black.bgCyan(`Updated ${data.updateRole.name}'s role to ${data.chooseRole.title}.`));
                    menu();
                });
            });
        });
    });
};

// This function is the main menu that will run all other functions based on the selection.
function menu() {
    inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'View All Employees By Role', 'View All Department Budgets', 'Add Department', 'Add Role', 'Add Employee', 'Delete Department', 'Delete Role', 'Delete Employee', 'Update Employee Manager', 'Update Employee Role', 'Quit'],
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
            case 'View All Employees By Manager':
                viewEmployeeByMgr();
                break;
            case 'View All Employees By Role':
                viewEmployeeByRole();
                break;
            case 'View All Department Budgets':
                viewDepartmentBudget();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Update Employee Manager':
                updateManager();
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

// This function will log out the text art on application start and then run the menu() function that runs the rest of the application.
function init() {
    console.log(white.bold(`
 _______________________________________________________________________________________
|` + cyan(`       _______  __   __  _______  ___      _______  __   __  _______  _______          `) + `|
|` + cyan(`      |       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |         `) + `|
|` + cyan(`      |    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|         `) + `|
|` + cyan(`      |   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___          `) + `|
|` + cyan(`      |    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|         `) + `|
|` + cyan(`      |   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___          `) + `|
|` + cyan(`      |_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|         `) + `|
|` + cyan(`   _______  _______  __    _  _______  ______    _______  _______  _______  ______     `) + `|
|` + cyan(`  |       ||       ||  |  | ||       ||    _ |  |   _   ||       ||       ||    _ |    `) + `|
|` + cyan(`  |    ___||    ___||   |_| ||    ___||   | ||  |  |_|  ||_     _||   _   ||   | ||    `) + `|
|` + cyan(`  |   | __ |   |___ |       ||   |___ |   |_||_ |       |  |   |  |  | |  ||   |_||_   `) + `|
|` + cyan(`  |   ||  ||    ___||  _    ||    ___||    __  ||       |  |   |  |  |_|  ||    __  |  `) + `|
|` + cyan(`  |   |_| ||   |___ | | |   ||   |___ |   |  | ||   _   |  |   |  |       ||   |  | |  `) + `|
|` + cyan(`  |_______||_______||_|  |__||_______||___|  |_||__| |__|  |___|  |_______||___|  |_|  `) + `|
|_______________________________________________________________________________________|
`));
    menu();
};