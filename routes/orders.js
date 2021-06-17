const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

router.get('/', async (req, res) => {
    const orderList = await Order.find()
        .populate('user', 'name')
        .sort({ dateOrdered: -1 });
    if (!orderList) {
        return res.status(500).json({ success: false });
    }
    res.status(200).send(orderList);
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' },
            });
        if (!order) {
            return res
                .status(500)
                .json({ success: false, message: 'Order not found' });
        }
        res.status(200).send(order);
    } catch (error) {
        res.json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const orderItemsIds = Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                });

                newOrderItem = await newOrderItem.save();
                return newOrderItem._id;
            })
        );
        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(
            orderItemsIdsResolved.map(async (orderItemId) => {
                const orderItem = await OrderItem.findById(
                    orderItemId
                ).populate('product', 'price');
                const totalPrice = orderItem.product.price * orderItem.quantity;
                return totalPrice;
            })
        );

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        const order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            totalPrice: totalPrice,
            user: req.body.user,
        });
        newOrder = await order.save();

        if (!newOrder)
            return res.status(400).send('the order cannot be created!');

        res.status(200).send(newOrder);
    } catch (error) {
        res.json(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
            },
            { new: true }
        );
        if (!order) {
            return res
                .status(500)
                .json({ success: false, message: 'Order not found' });
        }
        res.status(200).send(order);
    } catch (error) {
        res.json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndRemove(req.params.id);
        if (order) {
            await order.orderItems.map(async (orderItem) => {
                await OrderItem.findByIdAndRemove(orderItem);
            });
            return res
                .status(200)
                .json({ success: true, message: 'Deleted successfully' });
        } else {
            return res
                .status(404)
                .json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        res.send(error);
    }
});

router.get('/get/totalSales', async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
        ]);
        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated');
        }
        res.send({ totalSales: totalSales.pop().totalSales });
    } catch (error) {
        res.send(error);
    }
});

router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count);
    if (!orderCount) {
        return res.status(500).send('Not found');
    }
    res.status(200).json({
        count: orderCount,
    });
});

router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userid })
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                populate: 'category',
            },
        })
        .sort({ dateOrdered: -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false });
    }
    res.send(userOrderList);
});
module.exports = router;
