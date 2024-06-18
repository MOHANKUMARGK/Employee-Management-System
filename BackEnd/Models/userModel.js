let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let employeeSchema = new Schema({
    emp_no: {
        type: Number,
        required: true,
        unique: true,
        min: [1000, 'Employee number must be greater than 1000'] 
    },
    birth_date: {
        type: Date,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    hire_date: {
        type: Date,
        required: true
    },
    
});

let salarySchema = new Schema({
    emp_no: {
        type: Schema.Types.Number,
        ref: 'Employee',
        required: true,
        min: [1000, 'Employee number must be greater than 1000']
    },
    salary: {
        type: Number,
        required: true
    },
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
        required: true
    }
});

let titleSchema = new Schema({
    emp_no: {
        type: Schema.Types.Number,
        ref: 'Employee',
        required: true,
        min: [1000, 'Employee number must be greater than 1000']
    },
    title: {
        type: String,
        required: true
    },
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
        required: true
    }
});

let departmentSchema = new Schema({
    emp_no: {
        type: Schema.Types.Number,
        ref: 'Employee',
        required: true,
        min: [1000, 'Employee number must be greater than 1000']
    },
    dept_no: {
        type: Number,
        required: true,
        min: [1, 'Department number must be greater than 0']
    },
    dept_name: {
        type: String,
        required: true
    }
});

let departmentManagerSchema = new Schema({
    emp_no: {
        type: Schema.Types.Number,
        ref: 'Employee',
        required: true,
        min: [1000, 'Employee number must be greater than 1000'] 
    },
    dept_no: {
        type: Schema.Types.Number,
        ref: 'Department',
        required: true,
        min: [1, 'Department number must be greater than 0']
    },
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
        required: true
    }
});

let departmentEmployeeSchema = new Schema({
    emp_no: {
        type: Schema.Types.Number,
        ref: 'Employee',
        required: true,
        min: [1000, 'Employee number must be greater than 1000'] 
    },
    dept_no: {
        type: Schema.Types.Number,
        ref: 'Department',
        required: true,
        min: [1, 'Department number must be greater than 0']
    },
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
        required: true
    }
});

let Employee = mongoose.model('Employee', employeeSchema);
let Salary = mongoose.model('Salary', salarySchema);
let Title = mongoose.model('Title', titleSchema);
let Department = mongoose.model('Department', departmentSchema);
let Department_Manager = mongoose.model('Department_Manager', departmentManagerSchema);
let Department_Employee = mongoose.model('Department_Employee', departmentEmployeeSchema);

module.exports = {
    Employee,
    Salary,
    Title,
    Department,
    Department_Manager,
    Department_Employee
};