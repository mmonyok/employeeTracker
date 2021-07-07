const inquirer = require('inquirer');
const cTable = require('console.table');

// Main menu prompt; this will always populate after every prompt is complete.
const menu = [
    {
        type: 'list',
        message: "What would you like to do?",
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Role', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit'],
        name: 'menu',
    }
];

const empByDpt = [
    {
        type: 'list',
        message: "Which department's employees would you like to view?",
        choices: ['Department List'],
        name: 'viewDpt',
    }
];

const empByRole = [
    {
        type: 'list',
        message: "Which Role would you like to view?",
        choices: ['Role List'],
        name: 'viewRole',
    }
];

// Would like to add a question asking if they want to add another department.
const addDpt = [
    {
        message: "What is the name of the new department?",
        name: 'dptName',
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