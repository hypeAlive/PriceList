import express from "express";
import cors from "cors";
import config from "../config.json";
import helmet from "helmet";
import cookieParser from 'cookie-parser';

export default class {

    static generatePort() {
        return process.env.port || process.env.PORT || 3000;
    }

    static createApp(port, url = config.url) {
        const app = express();

        //SetUp
        app.use(helmet());
        app.set('case sensitive routing', false);
        app.set('view engine', 'ejs');
        app.use(cookieParser());

        //Middleware
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
        app.use(cors({origin: url}));
        app.options('*', cors());
        app.use(express.static('public'));

        app.listen(port, () => {
            console.log('server up');
        });

        return app;
    }

    static getApiRoot() {
        if (config.apiRoot === '') {
            return '/api'
        } else {
            return config.apiRoot;
        }
    }

}