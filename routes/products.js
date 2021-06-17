const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');

const MAP_FILE_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = MAP_FILE_TYPE[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(' ', '-');
        const extension = MAP_FILE_TYPE[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get('/', async (req, res) => {
    //localhost:3000/api/v1/products?categories=1111,222
    try {
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }

        const products = await Product.find(filter).populate('category');
        if (!products) {
            return res.status(500).send('No products found');
        }
        res.status(200).send(products);
    } catch (error) {
        res.send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'category'
        );
        if (!product) {
            return res.status(500).send('Product not found');
        }
        res.status(200).send(product);
    } catch (error) {
        res.send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (!product) {
            return res.status(500).send('Product not found');
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.send(error);
    }
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(500).send('Invalid category');
        }
        const file = req.file;
        if (!file) {
            return res.status(500).send('File not found');
        }
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        let product = new Product({
            category: req.body.category,
            image: `${basePath}${fileName}`,
            ...req.body,
        });

        product = await product.save();
        if (product) {
            res.status(201).json(product);
        }
    } catch (error) {
        res.status(500).json({
            error: err,
            success: false,
        });
    }
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(500).send('Invalid category');
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(500).send('Product not found');
        }

        const file = req.file;
        let imagePath;
        if (file) {
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/upload/`;
            imagePath = `${basePath}${fileName}`;
        } else {
            imagePath = product.image;
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                image: imagePath,
                ...req.body,
            },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(500).send('Product not found');
        }
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.send(error);
    }
});

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        try {
            const files = req.files;
            let imagePaths = [];
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/upload`;
            if (files) {
                files.map((file) => {
                    imagePaths.push(`${basePath}${file.filename}`);
                });
            }
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    images: imagePaths,
                },
                { new: true }
            );
            if (!product) {
                return res.status(500).send('Product not found');
            }
            res.send(product);
        } catch (error) {
            return res.send(error);
        }
    }
);

// Get products count

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);
    if (!productCount) {
        return res.status(500).send('Not found');
    }
    res.status(200).json({
        count: productCount,
    });
});

// Get featured procucts

router.get('/get/featured/:count', async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const products = await Product.find({ isFeatured: true }).limit(+count);
        if (!products) {
            return res.status(500).send('No products found');
        }
        res.status(200).send(products);
    } catch (error) {
        res.send(error);
    }
});

// Filter products by catgeroies

router.get('/get', async (req, res) => {});

module.exports = router;
