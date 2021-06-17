const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
//routes
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/users');
const orderRouter = require('./routes/orders');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

const apiUrl = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('public/uploads', express.static(__dirname + 'public/uploads'));
app.use(errorHandler);

app.use(`${apiUrl}/products`, productsRouter);
app.use(`${apiUrl}/categories`, categoriesRouter);
app.use(`${apiUrl}/users`, userRouter);
app.use(`${apiUrl}/orders`, orderRouter);

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    })
    .then(() => console.log('Database is connected'))
    .catch((err) => console.log('error', err));

app.listen(port, () => {
    console.log('Server is listening on 3000');
});
