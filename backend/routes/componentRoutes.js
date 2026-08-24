const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/components
// Get all components
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM components ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching components:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// GET /api/components/:id
// Get a single component
router.get("/:id", async (req, res) => {
    const componentId = Number(req.params.id);

    if (!Number.isInteger(componentId) || componentId <= 0) {
    return res.status(400).json({
        message: "Invalid component ID"
    });
}
    try {
        const result = await pool.query(
            "SELECT * FROM components WHERE id = $1",
            [componentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Component not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching component:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// POST /api/components
// Create a new component
router.post("/", async (req, res) => {
    const {
        name,
        description,
        category,
        quantity,
        condition,
        owner_id
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO components
            (name, description, category, quantity, condition, owner_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [name, description, category, quantity, condition, owner_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating component:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// PUT /api/components/:id
// Update an existing component
router.put("/:id", async (req, res) => {
    const componentId = Number(req.params.id);

    if (!Number.isInteger(componentId) || componentId <= 0) {
        return res.status(400).json({
            message: "Invalid component ID"
        });
    }

    const {
        name,
        description,
        category,
        quantity,
        condition
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE components
             SET
                 name = $1,
                 description = $2,
                 category = $3,
                 quantity = $4,
                 condition = $5
             WHERE id = $6
             RETURNING *`,
            [
                name,
                description,
                category,
                quantity,
                condition,
                componentId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Component not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating component:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// DELETE /api/components/:id
// Delete a component
router.delete("/:id", async (req, res) => {
    const componentId = Number(req.params.id);

    if (!Number.isInteger(componentId) || componentId <= 0) {
        return res.status(400).json({
            message: "Invalid component ID"
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM components
             WHERE id = $1
             RETURNING *`,
            [componentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Component not found"
            });
        }

        res.json({
            message: "Component deleted successfully",
            component: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting component:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;