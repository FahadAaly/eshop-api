const Category = require('../models/category');

module.exports = {
    GetCategoryList: async (req, res) => {
        const categoryList = await Category.find();
        if (!categoryList) {
            return res.status(500).json({ success: false });
        }
        res.status(200).send(categoryList);
    },

    GetCategoryById: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res
                    .status(500)
                    .json({ success: false, message: 'Category not found' });
            }
            res.status(200).send(category);
        } catch (error) {
            res.json(error);
        }
    },

    PostCategory: async (req, res) => {
        try {
            let category = new Category({
                ...req.body,
            });

            category = await category.save();
            if (!category) {
                return res.status(404).send('The category cannot be created');
            }
            res.status(200).send(category);
        } catch (error) {
            res.send(error);
        }
    },

    UpdateCategory: async (req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                },
                { new: true }
            );
            if (!category) {
                return res
                    .status(500)
                    .json({ success: false, message: 'Category not found' });
            }
            res.status(200).send(category);
        } catch (error) {
            res.json(error);
        }
    },

    DeleteCategory: async (req, res) => {
        try {
            const category = Category.findByIdAndRemove(req.params.id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Deleted successfully',
                });
            }
        } catch (error) {
            res.send(error);
        }
    },

    GetCategoryCount: async (req, res) => {
        const categoryCount = await Category.countDocuments((count) => count);
        if (!categoryCount) {
            return res.status(500).send('Not found');
        }
        res.status(200).json({
            count: categoryCount,
        });
    },
};
