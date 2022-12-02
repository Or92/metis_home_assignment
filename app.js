const express = require('express');
const app = express();
require('dotenv').config();
const DB = require('./config/db');
const logger = require('./config/logger');
const indexRouter = require('./routers/index');

globalThis['logger'] = logger;

(async () => {
    try {
        console.log('init db...');
        await DB.authenticate();

        console.log('init app router...');
        indexRouter(app);

        const { PORT } = process.env;
        const port = PORT || 3000;
        app.listen(port, () => console.log(`server is listening on port ${port}...`));
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
})();