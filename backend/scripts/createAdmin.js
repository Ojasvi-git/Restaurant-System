require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,);

        console.log("Connected to MongoDB");

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error("Please configure ADMIN_EMAIL and ADMIN_PASSWORD in .env");
        }

        if (adminPassword.length < 6) {
            throw new Error("Admin password must be at least 6 characters long");
        }

        const existingUser = await User.findOne({ email: adminEmail });

        if (existingUser) {
            if (existingUser.role === "admin") {
                console.log("Admin user already exists.");
            } else {
                console.log("A user with this email already exists but is not an admin." + "choose a different email for the admin.");
            }
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        await User.create({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin user created successfully.");
        console.log(`Admin Email: ${adminEmail}`);
        console.log("you can log in ");
    } catch (error) {
        console.error("Error creating admin failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();