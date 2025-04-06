const { body, validationResult } = require("express-validator");
const Lol = require("../model/mongodb");
const handlerequest = async (req, res) => {
    const { action } = req.body;  // ⬅️ This is the fix
    if (action === "creation") {
        res.redirect("/create");
    } else if (action === "show") {
        res.redirect("/show");
    }
    else if (action === "search") {
        res.redirect("/search");
    } else {
        res.status(400).send("Invalid action.");
    }
};

// Shared validation
const validationRules = [
    body("firstName").trim().isAlpha().withMessage("First name must contain only letters").isLength({ min: 1, max: 10 }),
    body("lastName").trim().isAlpha().withMessage("Last name must contain only letters").isLength({ min: 1, max: 10 }),
    body("gmail").trim().isEmail().withMessage("Please enter a valid email").custom((value) => {
        if (!value.endsWith("@gmail.com")) {
            throw new Error("Email must be a Gmail address.");
        }
        return true;
    }),
    body("age").trim().isInt({ min: 18 }).withMessage("User must be greater than 18 years old")
];

// Unified handler
const handleUserAction = [
    validationRules,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("form", {
                title: "Create user",
                errors: errors.array(),
            });
        }
        const { firstName, lastName, gmail, age, action } = req.body;

        if (action === "signup") {
            try {
                const existingUser = await Lol.findOne({ firstName: firstName, lastName: lastName, gmail });
                if (existingUser) {
                    return res.status(400).render("form", {
                        errors: [{ msg: "User already exists please sign in" }],
                    });

                }
                const newUser = await Lol.create({ firstName: firstName, lastName: lastName, gmail, age });

                res.redirect(`/${newUser._id}`);
            } catch (err) {
                console.error(err);
                res.status(500).send("Something went wrong during signup.");
            }
        } else if (action === "signin") {
            try {
                const existingUser = await Lol.findOne({ firstName: firstName, lastName: lastName, gmail });
                if (!existingUser) {
                    return res.status(404).send("User not found. Please sign up.");
                }
                res.redirect(`/${existingUser._id}`);
            } catch (err) {
                console.error(err);
                res.status(500).send("Something went wrong during signin.");
            }
        } else {
            res.status(400).send("Invalid action.");
        }
    }
];

const showForm = (req, res) => {
    res.render("form");
};

const showUser = async (req, res) => {
    try {
        const user = await Lol.findById(req.params.id);
        if (!user) return res.status(404).send("User not found.");
        res.render("user", { user });
    } catch (err) {
        res.status(500).send("Error loading user.");
    }
};
const showingallusers = async (req, res) => {
    try {
        const users = await Lol.find();
        res.render("show", { users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading users.");
    }
};
const searchbyname = async (req, res) => {
    const { name } = req.body;

    try {
        const users = await Lol.find({ firstName: name });

        if (users.length === 0) {
            return res.render("showresult", { users: [], message: "No users found." });
        }

        res.render("showresult", { users, message: null });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while searching.");
    }
};

module.exports = {
    showForm,
    handleUserAction,
    showUser,
    handlerequest,
    showingallusers,
    searchbyname
};
