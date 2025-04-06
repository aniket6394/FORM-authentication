const mongoose = require("mongoose");

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://aniketrajsingh2005:clRdZSXsXNMzIUuY@cluster0.5wyqaju.mongodb.net/Users?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit process on failure
    }
};

connectDB();

// Define Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gmail: String,
    age: Number
}, { collection: "Data" });
const Lol = mongoose.model("Data", userSchema);
module.exports = Lol;