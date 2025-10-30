const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"))

// Routes


// Start Server
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});

// Start the server with the command: node server.js
// Or use node --watch server.js for automatic restarts on file changes