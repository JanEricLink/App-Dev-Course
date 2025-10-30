const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"))

// Routes
app.get('/token', (req, res) => {
    const token = req.headers['authorization'];
    if (token) {
        res.json({ valid: true });
    } else {
        res.status(401).json({ valid: false });
    }
});

app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    // Beispiel: einfache Überprüfung (nicht für Produktion geeignet)
    if (username === 'admin' && password === '1234') {
        res.send('Login erfolgreich!');
    } else {
        res.send('Falscher Benutzername oder Passwort.');
    }
});

app.get('/createuser', (req, res) => {
    const username = req.query.username;
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const email = req.query.email;
    const password = req.query.password;
    const userExists = Users.some(user => user.username === username);
    if (userExists) {
        res.send('Benutzername existiert bereits.');
    } else {
        Users.push(new User(username, firstname, lastname, email, password));
        res.sendFile(path.join(__dirname, 'public', 'acc_created.html'));
    }
});

// Code
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
    let Users = [new User('admin', 'admin', 'admin', 'admin@admin.de', '1234')];


// Start Server
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});

// Start the server with the command: node server.js
// Or use node --watch server.js for automatic restarts on file changes