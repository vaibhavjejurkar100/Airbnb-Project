const express = require("express");
const router = express.Router();

//Users
//Index Route
router.get("/", (req, res) => {
    res.send("GET for users");
});

//Show Route
router.get("/:id", (req, res) => {
    res.send("GET for user id");
});

//Post Route
router.get("/", (req, res) => {
    res.send("GET for users");
});

//Delete Route
router.get("/:id", (req, res) => {
    res.send("GET for user id");
});

module.exports = router;