import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SECRET_KEY = crypto.randomBytes(64).toString('hex');

export default class {

    static authUser(req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const userId = this.verifyAuthToken(token);

            if (userId) return userId; else return null;
        } else {
            console.log(req.cookies);
            const authToken = req.cookies.authToken;
            const userId = this.verifyAuthToken(authToken);

            if (userId) return userId; else return null;
        }
    }

    static generateAuthToken(userId) {
        return jwt.sign({userId}, SECRET_KEY);
    }

    static verifyAuthToken(token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return decoded.userId;
        } catch (err) {
            console.log("Es wurde eine Anfrage mit einem falschen AuthToken an den Server gesendet!");
            return err
        }
    }

    static setAuthCookie(res, token) {
        res.cookie('authToken', token, {maxAge: 86400000, httpOnly: true});
    }

    static clearAuthCookie(res) {
        res.clearCookie('authToken');
    }

    static hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    static comparePasswords(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }

    static isLoggedIn(req){
        return req.cookies.authToken;
    }

}