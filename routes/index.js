const router = require('express').Router();

const apiUrl = process.env.API_URL;

const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const userRouter = require('./users');
const orderRouter = require('./orders');

router.use(`${apiUrl}/products`, productsRouter);
router.use(`${apiUrl}/categories`, categoriesRouter);
router.use(`${apiUrl}/users`, userRouter);
router.use(`${apiUrl}/orders`, orderRouter);

module.exports = router;
