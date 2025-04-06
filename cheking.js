const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://aniketrajsingh2005:clRdZSXsXNMzIUuY@cluster0.5wyqaju.mongodb.net/Users?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
};

connectDB();
