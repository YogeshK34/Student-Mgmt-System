const bcrypt = require("bcrypt");

// this will act as an in-memory DB for our application
let students = [
    {
        id: 1,
        prn_no: 1272250561,
        name: "Yogesh",
        username: "yogesh",
        password: bcrypt.hashSync("password123", 10),
        program: "MSC Blockchain"
    },
    {
        id: 2,
        prn_no: 1272250562,
        name: "Atharva",
        username: "atharva",
        password: bcrypt.hashSync("password123", 10),
        program: "MSC Blockchain"
    },
    {
        id: 3,
        prn_no: 1272250563,
        name: "Sarthak",
        username: "sarthak",
        password: bcrypt.hashSync("password123", 10),
        program: "MSC Blockchain"
    },
    {
        id: 4,
        prn_no: 1272250564,
        name: "Nikhil",
        username: "nikhil",
        password: bcrypt.hashSync("password123", 10),
        program: "MSC DSBDA"
    },
    {
        id: 5,
        prn_no: 1272250565,
        name: "Saurabh",
        username: "saurabh",
        password: bcrypt.hashSync("password123", 10),
        program: "MSC Blockchain"
    }
]

module.exports = { students };