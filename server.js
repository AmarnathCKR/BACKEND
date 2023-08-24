const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

const server = app.listen(5000, function () {
    console.log("Server is running on port 5000 ");
});