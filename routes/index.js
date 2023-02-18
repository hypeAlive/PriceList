import express from 'express';
import DatabaseUtil from "../utils/DatabaseUtil";
import {connection} from "../app";
import UserAuthUtil from "../utils/UserAuthUtil";

const router = express.Router();

export default router.get("/", async (req, res, next) => {

    if (UserAuthUtil.isLoggedIn(req)) {
        const userId = UserAuthUtil.authUser(req);
        //const userData = await DatabaseUtil.getDataByTable("users", connection, {uuid: userId})
        console.log("data")
    }
    try {
        let data = await DatabaseUtil.getDataByTable("citybuild", connection, {
            name: "BLAL", category: "special"
        });
        res.render("index", {
            data: data
        });
    } catch (err) {
        next(err);
    }
});
