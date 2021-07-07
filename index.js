const inquirer = require('inquirer');

const menu = [
    {
        type: 'list',
        message: "What would you like to do?",
        choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'Add Role', 'Remove Role'],
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

/* const empByMgr = [
    {
        type: 'list',
        message: "Which manager's employees would you like to view?",
        choices: ['Manager List'],
        name: 'viewMgr',
    }
]; */

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
    /*     {
            type: 'list',
            message: "Who is the employee's manager?",
            choices: ['None', 'Manager Choices'],
            name: 'empMgr',
        }, */
];
// console.log("Added {Employee Name} to the database.")

const deleteEmp = [
    {
        type: 'list',
        message: "Which employee do you want to remove?",
        choices: ['Employee List', 'Need to figure out', 'How to dynamically generate', 'This list'],
        name: 'removeEmp'
    }
];
// console.log("Removed {Employee Name} from the database.")

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

const updateMgr = [
    {
        type: 'list',
        message: "Which employee's manager do you want to update?",
        choices: ['Employee List'],
        name: 'updateMgr',
    },
    {
        type: 'list',
        message: "Which employee do you want to set as manager for the selected employee?",
        choices: ['Employee List'],
        name: 'chooseMgr',
    }
];
// console.log("Updated {Employee Name}'s manager.")

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

const deleteRole = [
    {
        type: 'list',
        message: "Which role do you want to remove?",
        choices: ['Role List'],
        name: 'removeRole',
    }
];
// console.log("Removed {removeRole} as a role.")