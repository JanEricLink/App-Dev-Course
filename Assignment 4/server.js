const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static("www"))

// Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
app.get('/time', (req, res) => {
    const now = new Date();
    const jsonData = {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds()
    };
    res.json(jsonData);
});

// Start Server
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});