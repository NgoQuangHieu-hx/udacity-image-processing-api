import express = require('express');
import cors = require('cors');
import product_routes from '../src/handle/products';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

product_routes(app);

app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
});
