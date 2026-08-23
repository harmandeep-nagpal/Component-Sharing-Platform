const express = require("express");

const router = express.Router();

// Temporary in-memory component data
const components = [
    {
        id: 1,
        name: "Arduino Uno",
        category: "Microcontroller",
        quantity: 3
    },
    {
        id: 2,
        name: "MPU6050",
        category: "Sensor",
        quantity: 5
    }
];

// GET /api/components
// Get all components
router.get("/", (req, res) => {
    res.json(components);
});

// GET /api/components/:id
// Get a single component
router.get("/:id", (req, res) => {
    const componentId = Number(req.params.id);

    const component = components.find(
        (component) => component.id === componentId
    );

    if (!component) {
        return res.status(404).json({
            message: "Component not found"
        });
    }

    res.json(component);
});

// POST /api/components
// Create a new component
router.post("/", (req, res) => {
    const { name, category, quantity } = req.body;

    const newComponent = {
        id: components.length + 1,
        name,
        category,
        quantity
    };

    components.push(newComponent);

    res.status(201).json(newComponent);
});

// PUT /api/components/:id
// Update an existing component
router.put("/:id", (req, res) => {
    const componentId = Number(req.params.id);

    const component = components.find(
        (component) => component.id === componentId
    );

    if (!component) {
        return res.status(404).json({
            message: "Component not found"
        });
    }

    const { name, category, quantity } = req.body;

    component.name = name;
    component.category = category;
    component.quantity = quantity;

    res.json(component);
});

// DELETE /api/components/:id
// Delete a component
router.delete("/:id", (req, res) => {
    const componentId = Number(req.params.id);

    const componentIndex = components.findIndex(
        (component) => component.id === componentId
    );

    if (componentIndex === -1) {
        return res.status(404).json({
            message: "Component not found"
        });
    }

    const deletedComponent = components.splice(componentIndex, 1);

    res.json({
        message: "Component deleted successfully",
        component: deletedComponent[0]
    });
});

module.exports = router;