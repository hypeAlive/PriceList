import express from 'express';

const router = express.Router();

export default router.get("/users", (req, res, next) => {
    res.render("users.ejs");
});