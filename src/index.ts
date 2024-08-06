import express from 'express';
import routes from './routes/index';
const fs = require("fs");

const app = express();
const port = 3000;

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server started at localhost: ${port}`);
})