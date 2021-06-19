const express = require('express');
const router = express.Router();
const multer = require('multer');
const ProductController = require('../controllers/products');
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

router.get('/', ProductController.GetProductList);
router.get('/:id', ProductController.GetProductById);
router.post('/', uploadOptions.single('image'), ProductController.PostProduct);
router.put('/:id', ProductController.UpdateProduct);
router.delete('/:id', ProductController.DeleteProduct);
router.get('/count', ProductController.GetProductCount);
router.get('/featured/:count', ProductController.GetFeaturedProducts);
router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    ProductController.GetFeaturedProducts
);

module.exports = router;
