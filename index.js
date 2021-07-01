const inquirer = require('inquirer');

const menu = [
    {
        type: 'list',
        message: "What would you like to do?",
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
        name: 'menu'
    }
]