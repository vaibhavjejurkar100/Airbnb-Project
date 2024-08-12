const express = require("express");
const router = express.Router();

//Posts
//Index Route
router.get("/", (req, res) => {
    res.send("GET for posts");
});

//Show Route
router.get("/:id", (req, res) => {
    res.send("GET for post id");
});

//Post Route
router.get("/", (req, res) => {
    res.send("GET for posts");
});

//Delete Route
router.get("/:id", (req, res) => {
    res.send("GET for post id");
});

module.exports = router;