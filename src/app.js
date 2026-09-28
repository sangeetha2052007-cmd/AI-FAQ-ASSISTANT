const express = require("express");
const cors = require("cors");
const faqRoutes = require("./routes/faqRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/faqs", faqRoutes);
console.log("AUTH ROUTES:", authRoutes);
app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.json({
        message: "AI FAQ Assistant API is running"
    });
});

console.log("AUTH ROUTE LOADED");

module.exports = app;