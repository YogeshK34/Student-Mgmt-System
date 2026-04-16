
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { students } = require("./students");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");

const SECRET = process.env.JWT_SECRET || "Yogesh";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// GET route 
app.get("/", (req, res) => {
    // res.json({ students: students }, { status: 200 })
    res.status(200).json({ students: students })
});

app.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).json({ error: "Username & Password not provided!" })
        };

        // find the user in the DB
        const student = students.find(s => s.username === username && s.password === password);

        if (!student) {
            return res.status(401).json({ error: "Invalid credentails" });
        };

        // sign the token 
        const token = jwt.sign(
            { userId: student.id, username: student.username },
            SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ token })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    };
});

// GET protected route 
app.get("/profile", authMiddleware, (req, res) => {
    const student = students.find(s => s.id === req.user.userId);
    return res.status(200).json({ student: req.user }) // can also send student
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});