// Import our required libraries.
const express = require("express");
const sqlite3 = require("sqlite3");

// Express is a library that allows us to serve web requests.
const app = express();

// This is the database, which uses SQLite technology.
const database = new sqlite3.Database("app.db");

// Needed to understand incoming requests.
app.use(express.json());

// Quick handler to get the index file.
app.get("/", (_, r) => { require("fs").readFile("app.html", "utf8", (_, d) => r.send(d)) });

// List all tasks.
app.get("/api/task/list", function(request, response) {
    // Ask the database to retrieve everything on my to-do list.
    database.all("SELECT * FROM todo", function(error, data) {
        // Send back all the data.
        response.send(JSON.stringify(data));
    });
});

// Add a new task.
app.post("/api/task/add", function(request, response) {
    // Get the task from the request.
    const newTask = request.body.task;

    // Add it to the database.
    database.run("INSERT INTO todo (task) VALUES ($task)", {
        $task: newTask,
    }, function(error) {
        if (error) {
            // An error happened, which is represented by 500.
            response.statusCode = 500;
        } else {
            // 200 means that things worked fine.
            response.statusCode = 200;
        }

        response.send();
    });
});

// This tells Express to start waiting for requests to come in.
app.listen(3000, function() { console.log("Listening on port 3000") });