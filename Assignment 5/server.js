const express = require('express');
const fs = require('fs');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "supergeheimesessionkey", // unbedingt geheim halten
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30, httpOnly: true } // 30 Minuten
}));
app.set("view engine", "ejs");

// Routes
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    for (let user of Users) {
        if (user.username === username && user.password === password) {
            req.session.user = {
                username: user.username,
                email: user.email
            };
            return res.redirect("/todo");
        }
    }
    return res
        .status(401)
        .render("login", { error: "Invalid username or password" });
});

app.post('/createuser', (req, res) => {
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    console.log(req.body);
    if (cpassword !== password) {
        return res
            .status(409)
            .render("signin", { error: "Passwords do not match" });
    }
    try {
        // Check if user already exists
        let existingUser = null;
        for (let user of Users) {
            if (user.username === username) {
                existingUser = user;
                break;
            }}
        if (existingUser) {
            return res
                .status(409)
                .render("signin", { error: "Username already exists" });
        }
        // Create and save the new user
        const newUser = new User(username, firstname, lastname, email, password);
        Users.push(newUser);

        console.log("Users:", Users);
        return res.redirect("login.html");
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        res.redirect("/index.html");
    });
});

app.get("/session-status", (req, res) => {
    res.json({ isLoggedIn: !!req.session.user });
});

app.get('/todo', (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login.html");
    }
    res.sendFile(path.join(__dirname, 'private', 'todo.html'));
});


//Classes
class User {
    constructor(username, firstname, lastname, email, password) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.todos = [];
    }
}

class Todo {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.completed = false;
    }
}

//Variables



// Start Server
let Users = fs.existsSync('users.json') ? JSON.parse(fs.readFileSync('users.json')) : [];
let server = app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});

// Stop Server
process.on('SIGINT', () => {
    console.log("Saving users to users.json...");
    fs.writeFileSync('users.json', JSON.stringify(Users, null, 2));
    console.log("Users saved.");

    console.log("\nServer shutting down...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

// Start the server with the command: node server.js
// Or use node --watch server.js for automatic restarts on file changes