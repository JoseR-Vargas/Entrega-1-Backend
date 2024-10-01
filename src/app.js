import express from 'express';
import products_router from './routes/products_router.js';
import cart_router from './routes/cart_router.js';
import config from './config.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', products_router);
app.use('/api/carts', cart_router);

app.listen(config.PORT, ()=>{
    console.log(`listening on PORT ${config.PORT}`);
})