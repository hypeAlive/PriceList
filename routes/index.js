import express from 'express';
import DatabaseUtil from "../utils/DatabaseUtil";
import {connection} from "../app";

const router = express.Router();

export default router.get("/", async (req, res, next) => {
    try {
        let data = await DatabaseUtil.getDataByTable("citybuild", connection, {
            name: "BLAL",
            category: "special"
        });
        res.render("index", {
            data: data
        });
    } catch (err) {
        next(err);
    }
});
