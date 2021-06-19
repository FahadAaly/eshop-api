const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orders');

router.get('/', OrderController.GetOrderList);
router.get('/:id', OrderController.GetOrderById);
router.post('/', OrderController.PostOrder);
router.put('/:id', OrderController.UpdateOrder);
router.delete('/:id', OrderController.DeleteOrder);
router.get('/count', OrderController.GetOrderCount);
router.get('/totalSalses', OrderController.GetTotalSales);
router.get('/userorders:userId', OrderController.GetUserOrdersByUserId);

module.exports = router;
