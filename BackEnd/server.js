const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors")
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
const { dbConnect } = require("./DB/dbConnect");
const { AdminRegister } = require("./Models/AdminRegister");
const { Employee, Salary, Department, Title, Department_Manager, Department_Employee } = require("./Models/userModel");

const app = express();

app.use(express.json());

app.use(cors())


const PORT = 5000;
const hostName = '127.0.0.1';

// Admin registration 
app.post('/adminregister', async (req, res) => {
    try {
        const data = req.body;
        const { password, email } = data;

        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailCheck.test(email)) {
            return res.status(400).send({ message: "Invalid email format" });
        }

        const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordCheck.test(password)) {
            return res.status(400).send({
                message: "Give valid password"
            });
        }

        const isUser = await AdminRegister.findOne({ email });
        if (isUser) {
            return res.status(400).send({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new AdminRegister({ ...data, password: hashedPassword });
        await userData.save();

        res.status(200).send({ message: "Successfully Registered" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// Admin login 
app.post("/adminlogin", async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;

        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailCheck.test(email)) {
            return res.status(400).send({ message: "Invalid email format" });
        }

        if (!password) {
            return res.status(400).send({ message: "Password is required" });
        }

        const user = await AdminRegister.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }

        res.status(200).send({ message: "Login Successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// create new employee
app.post('/createEmployee', async (req, res) => {
    const { emp_no, dept_no, employee, salary, department, title, departmentManager, departmentEmployee } = req.body;

    if (!emp_no || !dept_no || !employee || !salary || !department || !title || !departmentManager || !departmentEmployee) {
        return res.status(400).json({ message: "Required All Details" });
    }


    const newEmployee = new Employee({ ...employee, emp_no });
    const newSalary = new Salary({ ...salary, emp_no });
    const newDepartment = new Department({ ...department, emp_no, dept_no });
    const newTitle = new Title({ ...title, emp_no });
    const newDepartmentManager = new Department_Manager({ ...departmentManager, emp_no, dept_no });
    const newDepartmentEmployee = new Department_Employee({ ...departmentEmployee, emp_no, dept_no });

    try {
        const savedEmployee = await newEmployee.save();
        const savedSalary = await newSalary.save();
        const savedDepartment = await newDepartment.save();
        const savedTitle = await newTitle.save();
        const savedDepartmentManager = await newDepartmentManager.save();
        const savedDepartmentEmployee = await newDepartmentEmployee.save();

        res.status(201).json({ message: "Employee created successfully" });
    } catch (err) {
         if (err.code === 11000) {
            res.status(400).json({ message: "Employee number already exists" });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
});

app.get('/getEmployees', async (req, res) => {
    try {
        const employees = await Employee.find({}); // Retrieve all employees from the Employee collection
        res.status(200).json(employees); // Respond with the array of employees in JSON format
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle any errors and respond with a 500 status code
    }
});


app.get('/getEmployee/:emp_no', async (req, res) => {
    const emp_no = req.params.emp_no;
    const {employee, salary, department, title, departmentManager, departmentEmployee } = req.body;

    try {

        const findEmployee = await Employee.findOne({ emp_no });

        if (!findEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const findSalary = await Salary.findOne({ emp_no });

        const findDepartment = await Department.findOne({ emp_no });

        const findTitle = await Title.findOne({ emp_no });

        const findDepartmentManager = await Department_Manager.findOne({ emp_no });

        const findDepartmentEmployee = await Department_Employee.findOne({ emp_no });

        res.status(200).json({
            message: "Employee found",
            employee: findEmployee,
            salary: findSalary,
            department: findDepartment,
            title: findTitle,
            departmentManager: findDepartmentManager,
            departmentEmployee: findDepartmentEmployee
        })

    } catch (err) {
        if (err.name === 'ValidationError') {
            let errors = {};
            for (let field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            res.status(400).json({ message: "Validation Error", errors });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
});


// updating employee details
app.put('/updateEmployee/:emp_no', async (req, res) => {
    const emp_no = req.params.emp_no;
    const { dept_no, employee, salary, department, title, departmentManager, departmentEmployee } = req.body;

    if (!dept_no || !employee || !salary || !department || !title || !departmentManager || !departmentEmployee) {
        return res.status(400).json({ message: "Required All Details" });
    }

    try {
        if (req.body.emp_no !== emp_no) {
            return res.status(400).json({ message: "emp_no cannot be changed" });
        }
        const updatedEmployee = await Employee.findOneAndUpdate({ emp_no }, { ...employee }, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const updatedSalary = await Salary.findOneAndUpdate({ emp_no }, { ...salary }, { new: true });

        const updatedDepartment = await Department.findOneAndUpdate({ emp_no }, { ...department, dept_no }, { new: true });

        const updatedTitle = await Title.findOneAndUpdate({ emp_no }, { ...title }, { new: true });

        const updatedDepartmentManager = await Department_Manager.findOneAndUpdate({ emp_no }, { ...departmentManager, dept_no }, { new: true });

        const updatedDepartmentEmployee = await Department_Employee.findOneAndUpdate({ emp_no }, { ...departmentEmployee, dept_no }, { new: true });

        res.status(200).json({ message: "Employee updated successfully" });

    } catch (err) {
        if (err.name === 'ValidationError') {
            let errors = {};
            for (let field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            res.status(400).json({ message: "Validation Error", errors });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
});


// Deleting employee

app.delete('/deleteEmployee/:emp_no', async (req, res) => {
    const emp_no = req.params.emp_no;

    try {
        const deletedEmployee = await Employee.findOneAndDelete({ emp_no });

        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await Salary.findOneAndDelete({ emp_no });
        await Department.findOneAndDelete({ emp_no });
        await Title.findOneAndDelete({ emp_no });
        await Department_Manager.findOneAndDelete({ emp_no });
        await Department_Employee.findOneAndDelete({ emp_no });

        res.status(200).json({ message: "Employee and related records deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/searchEmployee', async (req, res) => {
    const { first_name, last_name } = req.query;

    if (!first_name && !last_name) {
        return res.status(400).json({ message: "At least one of first_name or last_name is required" });
    }

    let searchCriteria = {};
    if (first_name) {
        searchCriteria.first_name = new RegExp(first_name, 'i'); // case-insensitive search
    }
    if (last_name) {
        searchCriteria.last_name = new RegExp(last_name, 'i'); // case-insensitive search
    }

    try {
        const employees = await Employee.find(searchCriteria);

        if (employees.length === 0) {
            return res.status(404).json({ message: "No employees found matching the search criteria" });
        }

        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});







// Start the server and connect to the database
app.listen(PORT, hostName, () => {
    console.log(`Server running at http://${hostName}:${PORT}`);
    dbConnect();
});

