const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { students } = require("./students");
// const { students } = require("./students");

const app = express();
const port = 3000;
app.use(express.json());

// GET route 
app.get("/", (req, res) => {
    // res.json({ students: students }, { status: 200 })
    res.status(200).json({ students: students })
});

// POST route  
app.post("/register", async (req, res) => {
    try {
        const data = await req.body;

        if (!data.name || !data.prn_no || !data.program) {
            return res.status(403).json({ error: "Input fields do not match the expected pattern" })
        };

        // getting the current id 
        const newId = students.at.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

        // create a new js object with the input fields and id 
        const newStudent = {
            id: newId,
            name: data.name,
            prn_no: data.prn_no,
            program: data.program
        };

        // finally push 
        students.push(newStudent);

        return res.status(200).json({
            message: "Student registered successfully!",
            student: data
        });

    } catch (error) {
        console.error(error);
        return res.json({ error: "Internal Server Error" }, { status: 500 })
    }
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});