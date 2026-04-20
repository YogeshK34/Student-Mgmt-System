
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
let { students } = require("./students");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("./middleware");

const SECRET = process.env.JWT_SECRET || "Yogesh";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// GET all students
app.get("/", (req, res) => {
    const studentsList = students.map(s => ({
        id: s.id,
        name: s.name,
        prn_no: s.prn_no,
        program: s.program
    }));
    res.status(200).json({ students: studentsList })
});

// GET single student by ID
app.get("/student/:id", (req, res) => {
    const { id } = req.params;
    const student = students.find(s => s.id === parseInt(id));

    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
        student: {
            id: student.id,
            name: student.name,
            prn_no: student.prn_no,
            program: student.program
        }
    });
});

// POST - Create new student
app.post("/student", (req, res) => {
    try {
        const { name, prn_no, program, username, password } = req.body;

        if (!name || !prn_no || !program || !username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = students.find(s => s.username === username);
        if (existingUser) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newStudent = {
            id: Math.max(...students.map(s => s.id), 0) + 1,
            name,
            prn_no,
            program,
            username,
            password: hashedPassword
        };

        students.push(newStudent);
        res.status(201).json({
            student: {
                id: newStudent.id,
                name: newStudent.name,
                prn_no: newStudent.prn_no,
                program: newStudent.program
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT - Update student
app.put("/student/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, prn_no, program } = req.body;

        const student = students.find(s => s.id === parseInt(id));
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        if (name) student.name = name;
        if (prn_no) student.prn_no = prn_no;
        if (program) student.program = program;

        res.status(200).json({
            student: {
                id: student.id,
                name: student.name,
                prn_no: student.prn_no,
                program: student.program
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE student
app.delete("/student/:id", (req, res) => {
    try {
        const { id } = req.params;
        const index = students.findIndex(s => s.id === parseInt(id));

        if (index === -1) {
            return res.status(404).json({ error: "Student not found" });
        }

        const deletedStudent = students.splice(index, 1)[0];
        res.status(200).json({
            message: "Student deleted successfully",
            student: {
                id: deletedStudent.id,
                name: deletedStudent.name,
                prn_no: deletedStudent.prn_no,
                program: deletedStudent.program
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST - Login
app.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const student = students.find(s => s.username === username);

        if (!student) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = bcrypt.compareSync(password, student.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: student.id, username: student.username },
            SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            token,
            user: {
                id: student.id,
                name: student.name,
                username: student.username
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST - Register
app.post("/register", (req, res) => {
    try {
        const { name, prn_no, program, username, password } = req.body;

        if (!name || !prn_no || !program || !username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = students.find(s => s.username === username);
        if (existingUser) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newStudent = {
            id: Math.max(...students.map(s => s.id), 0) + 1,
            name,
            prn_no,
            program,
            username,
            password: hashedPassword
        };

        students.push(newStudent);

        const token = jwt.sign(
            { userId: newStudent.id, username: newStudent.username },
            SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            token,
            user: {
                id: newStudent.id,
                name: newStudent.name,
                username: newStudent.username
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET protected route - Profile
app.get("/profile", authMiddleware, (req, res) => {
    const student = students.find(s => s.id === req.user.userId);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
        user: {
            id: student.id,
            name: student.name,
            username: student.username,
            prn_no: student.prn_no,
            program: student.program
        }
    });
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});