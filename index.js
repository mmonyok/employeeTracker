// ask about default for init() switch statement.
// Why can't i have a separate connection.js file with raw sql instead of only with sequelize.

const inquirer = require('inquirer');
// const connection = require('./config/connection');
const cTable = require('console.table');

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

/* const util = require('util');
let dptPromise = util.promisify(connection.query);
async function test() {
    let response = await dptPromise('SELECT * FROM department;');
    console.table(response);
    // response.forEach(() => {
    //     array.push(response.department);
    // });
    // return array;
} */

// test();


// Main menu prompt; this will always populate after every prompt is complete.
const menu = [
    {
        type: 'list',
        message: "What would you like to do?",
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Role', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit'],
        name: 'menuChoice',
    }
];

const empByDpt = [
    {
        type: 'list',
        message: "Which department's employees would you like to view?",
        choices: ['Sales', 'Engineering', 'Finance', 'Legal'],
        /* choices: async function () {
            try {
                console.log('hello');
                let array = [];
                let array = [
                    { d_id: 1, department: 'Sales' },
                    { d_id: 2, department: 'Engineering' },
                    { d_id: 3, department: 'Finance' },
                    { d_id: 4, department: 'Legal' },
                ];
                return array;
                response = await dptPromise('SELECT * FROM department;');
                response.forEach(() => {
                    array.push(response.department);
                });
                return array;
            } catch (err) {
                console.log(err);
            }
            // console.log(typeof response);
        }, */
        name: 'viewDpt',
    }
];

const empByRole = [
    {
        type: 'list',
        message: "Which Role would you like to view?",
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Accountant', 'Legal Team Lead', 'Lawyer'],
        name: 'viewRole',
    }
];

// console.log("Added {dptName} as a department.")

// Would like to add a question asking if they want to add another role.
const addRole = [
    {
        message: "What is the title of the role?",
        name: 'roleTitle',
    },
    {
        type: 'list',
        message: "Please select the department for this role.",
        choices: ['Department List'],
        name: 'roleDpt',
    },
    {
        message: "What is the salary for this role?",
        name: 'roleSalary',
    }
];
// console.log("Added {roleTitle} as a role.")

// Would like to add a question asking if they want to add another employee.
const addEmp = [
    {
        message: "What is the employee's first name?",
        name: 'empFirstName',
    },
    {
        message: "What is the employee's last name?",
        name: 'empLastName',
    },
    {
        type: 'list',
        message: "What is the employee's role?",
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Accountant', 'Legal Team Lead', 'Lawyer'],
        name: 'empRoles',
    },
];
// console.log("Added {Employee Name} to the database.")

const updateRole = [
    {
        type: 'list',
        message: "Which employee's role do you want to update?",
        choices: ['Employee List'],
        name: 'updateRole',
    },
    {
        type: 'list',
        message: "Please select the new role for this employee.",
        choices: ['Role List'],
        name: 'chooseRole',
    }
]
// console.log("Updated {Employee Name}'s role.")

function viewAllEmployees() {
    connection.query('SELECT id, first_name, last_name, title, department, salary FROM employees INNER JOIN roles ON employees.roles_id = roles.r_id INNER JOIN departments ON roles.departments_id = departments.d_id;', (err, res) => {
        if (err) throw err;
        console.log(res);
        console.table(res);
        init();
    });
};

function viewEmployeeByDpt() {
    inquirer.prompt(empByDpt).then(res => {
        const dpt = res.viewDpt;
        connection.query(`SELECT id, first_name, last_name, title, salary FROM employees INNER JOIN roles ON employees.roles_id = roles.r_id INNER JOIN departments ON roles.departments_id = departments.d_id WHERE departments.department = '${dpt}';`, (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        });
    });
};

function viewEmployeeByRole() {
    inquirer.prompt(empByRole).then(res => {
        const role = res.viewRole;
        console.log(role);
        connection.query(`SELECT id, first_name, last_name, salary, department FROM employees INNER JOIN roles ON employees.roles_id = roles.r_id INNER JOIN departments ON roles.departments_id = departments.d_id WHERE roles.title = '${role}';`, (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        });
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            message: "What is the name of the new department?",
            name: 'dptName',
        }
    ]).then(res => {
        connection.query(`INSERT INTO departments (department) VALUES ('${res.dptName}');`);
        console.log(`Added ${res.dptName} as a department.`);
        init();
    })
}

function init() {
    inquirer.prompt(menu).then(res => {
        switch (res.menuChoice) {
            case 'View All Employees':
                console.log("You chose 'View All Employees'.");
                viewAllEmployees();
                break;
            case 'View All Employees By Department':
                console.log("You chose to view employees by department");
                viewEmployeeByDpt();
                break;
            case 'View All Employees By Role':
                console.log("You chose to view employees by role.")
                viewEmployeeByRole();
                break;
            case 'Add Department':
                console.log("You chose to add a department.");
                addDepartment();
                break;
            case 'Quit':
                console.log("You chose 'Quit.'")
                connection.end();
        }
    })
};