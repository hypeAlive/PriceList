import express from 'express';
import UserAuthUtil from "../utils/UserAuthUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

const router = express.Router();

export default router.get("/users", (req, res, next) => {

    const name = "_Alive_";
    const userId = DatabaseUtil.generateUUID();
    const password = "pass";

    const hashedPassword = UserAuthUtil.hashPassword(password);

    if(UserAuthUtil.comparePasswords(password, hashedPassword)){
        const token = UserAuthUtil.generateAuthToken(userId);
        UserAuthUtil.setAuthCookie(res, token);
        console.log("login succeed");
    }


    res.render("users.ejs");
});