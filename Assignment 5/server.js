const express = require('express');
const fs = require('fs');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "supergeheimesessionkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30, httpOnly: true }
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
            .render("signup", { error: "Passwords do not match" });
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
                .render("signup", { error: "Username already exists" });
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

app.get('/todo-items', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const username = req.session.user.username;
    const user = Users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user.groups || []);
});

app.post('/add-todo', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const username = req.session.user.username;
    const user = Users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    console.log("Request body:", req.body);
    const { title, description, group } = req.body;
    const newTodo = new Todo(title, description);
    console.log("Adding todo:", newTodo, "to group:", group);
    const currentGroup = user.groups.find(g => g.name === group);
    currentGroup.todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.post('/add-group', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const username = req.session.user.username;
    const user = Users.find(user => user.username === username);    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const { name, color } = req.body;
    const newGroup = new group(name, color);
    user.groups.push(newGroup);
    res.status(201).json(newGroup);
});


//Classes
class User {
    constructor(username, firstname, lastname, email, password) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.groups = [
            new group("Default", "#ffffff")
        ];
    }
}

class group {
    constructor(name, color) {
        this.name = name;
        this.color = color;
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


//Functions


//Reroutung all invalid routes to 404.html
app.use((req, res) => {
    res.status(404).sendFile(path.resolve("public/404.html"));
});

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
// Or use node --watch server.js for automatic restarts on file changes (might cause issues with session handling)