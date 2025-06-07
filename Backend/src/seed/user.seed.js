import { config } from "dotenv";
import connectDB from "../lib/dbConfig.js";
import User from "../models/userModel.models.js";

config();

const seedUsers = [
    {
        name: "Emma Thompson",
        email: "emma.thompson@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        name: "Olivia Miller",
        email: "olivia.miller@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        name: "Sophia Davis",
        email: "sophia.davis@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
        name: "Ava Wilson",
        email: "ava.wilson@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
        name: "Isabella Brown",
        email: "isabella.brown@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
        name: "Mia Johnson",
        email: "mia.johnson@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
        name: "Charlotte Williams",
        email: "charlotte.williams@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
        name: "Amelia Garcia",
        email: "amelia.garcia@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
    },

    // Male Users
    {
        name: "James Anderson",
        email: "james.anderson@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        name: "William Clark",
        email: "william.clark@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        name: "Benjamin Taylor",
        email: "benjamin.taylor@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        name: "Lucas Moore",
        email: "lucas.moore@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
        name: "Henry Jackson",
        email: "henry.jackson@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        name: "Alexander Martin",
        email: "alexander.martin@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
        name: "Daniel Rodriguez",
        email: "daniel.rodriguez@example.com",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        await User.insertMany(seedUsers);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Call the function
seedDatabase();