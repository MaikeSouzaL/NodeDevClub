import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);
const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', LoginController.store);

routes.use(authMiddleware);
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id', upload.single('file'), ProductController.update);
routes.delete('/products/delete/:id', ProductController.destroy);

routes.post('/categories', upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.delete('/categories/:id', CategoryController.destroy);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);

routes.post('/orders', OrderController.store);
routes.get('/order/:id', OrderController.show);
routes.get('/orders', OrderController.index);

routes.put('/orders/:id', OrderController.update);

export default routes;
