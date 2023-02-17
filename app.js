import DatabaseUtil from './utils/DatabaseUtil.js';
import ServerUtil from "./utils/ServerUtil";
import indexRouter from "./routes/index";
import config from './config.json';

const port = ServerUtil.generatePort();
const app = ServerUtil.createApp(port);

const connection = DatabaseUtil.createConnection();

app.use('/', indexRouter);
