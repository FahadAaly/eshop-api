const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categories');

router.get('/', CategoryController.GetCategoryList);
router.get('/:id', CategoryController.GetCategoryById);
router.post('/', CategoryController.PostCategory);
router.put('/:id', CategoryController.UpdateCategory);
router.delete('/:id', CategoryController.DeleteCategory);
router.get('/count', CategoryController.GetCategoryCount);

module.exports = router;
