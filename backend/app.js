const express = require("express");
const componentRoutes = require("./routes/componentRoutes");

const app = express();

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Lab Component Sharing Platform API is running"
    });
});

// Component routes
app.use("/api/components", componentRoutes);

module.exports = app;