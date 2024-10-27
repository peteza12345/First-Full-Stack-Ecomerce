const express = require('express');

const router = express.Router();

const userSignUpController = require('../controllers/userSignUp');
const userSignInController = require('../controllers/userSignIn');
const authToken = require('../middleware/authToken');
const userDetailsController = require('../controllers/userDetails');
const userLogout = require('../controllers/userLogout');
const allUsers = require('../controllers/allUsers');
const updateUser = require('../controllers/updateUser');
const uploadProductController = require('../controllers/product/uploadProduct');
const getProductController = require('../controllers/product/getProduct');
const updateProductControllor = require('../controllers/product/updateProduct');
const getCategoryProduct = require('../controllers/product/getCategoryProduct');
const getCategoryWiseProduct = require('../controllers/product/getCategoryWiseProduct');
const getProductDetails = require('../controllers/product/getProductDetails');
const addToCartControllor = require('../controllers/users/addToCartControllor');
const countAddToCartProduct = require('../controllers/users/countAddToCartProduct');
const addToCartViewProduct = require('../controllers/users/addToCartViewProduct');
const updateAddToCartProduct = require('../controllers/users/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controllers/users/deleteAddToCartProduct');
const searchProduct = require('../controllers/product/searchProduct');
const filterProductController = require('../controllers/product/filterProduct');
const paymentController = require('../controllers/order/paymentController');
const webhooks = require('../controllers/order/webhook');
const orderController = require('../controllers/order/orderController');
const allOrderController = require('../controllers/order/allOrderController');

router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/user-details', authToken, userDetailsController);
router.get('/userlogout', userLogout);

// Admin Panel
router.get('/all-user', authToken, allUsers);
router.post('/update-user', authToken, updateUser);

// Product
router.post('/upload-product', authToken, uploadProductController);
router.get('/get-product', getProductController);
router.post('/update-product', authToken, updateProductControllor);
router.get('/get-categoryProduct', getCategoryProduct);
router.post('/category-product', getCategoryWiseProduct);
router.post('/product-details', getProductDetails);
router.get('/search', searchProduct);
router.post('/filter-product', filterProductController);

// User Add To Cart
router.post('/addtocart', authToken, addToCartControllor);
router.get('/countAddToCartProduct', authToken, countAddToCartProduct);
router.get('/view-cart-product', authToken, addToCartViewProduct);
router.post('/update-cart-product', authToken, updateAddToCartProduct);
router.delete('/delete-cart-product', authToken, deleteAddToCartProduct);

// payment and order
router.post('/checkout', authToken, paymentController);
router.post('/webhook', webhooks);
router.get('/order-list', authToken, orderController);
router.get('/all-order', authToken, allOrderController);

module.exports = router;