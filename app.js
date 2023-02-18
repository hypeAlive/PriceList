import DatabaseUtil from './utils/DatabaseUtil.js';
import ServerUtil from "./utils/ServerUtil";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import config from './config.json';

const port = ServerUtil.generatePort();
export const app = ServerUtil.createApp(port);

export const connection = DatabaseUtil.createConnection();

app.use('/', indexRouter);
app.use('/', usersRouter);
