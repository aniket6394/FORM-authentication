const express = require("express");
const usersRouter = express.Router();
const Lol = require("../model/mongodb");
const { showForm, handleUserAction, showUser, handlerequest, showingallusers, searchbyname } = require("../controllers/userController");

usersRouter.get("/", (req, res) => {
    res.render("home");
});
usersRouter.get("/show", showingallusers);
usersRouter.post("/", handlerequest);
// Route to handle form submission
usersRouter.get("/create", showForm);
usersRouter.get("/search", (req, res) => {
    res.render("search"); // this renders your search.ejs
});
usersRouter.post("/search", searchbyname);
// Single POST route for both Sign Up and Sign In
usersRouter.post("/create", handleUserAction);
usersRouter.get("/:id", showUser);
usersRouter.post("/delete/:id", async (req, res) => {
    try {
        await Lol.findByIdAndDelete(req.params.id);
        console.log("✅ User deleted:", req.params.id);
        res.redirect("/");
    } catch (err) {
        console.error("❌ Failed to delete user:", err);
        res.status(500).send("Failed to delete user.");
    }
});

module.exports = usersRouter;
