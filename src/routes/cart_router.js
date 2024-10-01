import { Router } from 'express';

const router = Router();

const products = [
    { id: 1, title: 'Frutilla', description: 'string', code: '1', price: '100', status: true, stock: '90', category: 'frutas', thumbnails: ["https://res.cloudinary.com/dyg0knk2o/image/upload/v1722660748/frutilla_xjbb7r.jpg"] },
];


const carts = [];


router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find(cart => cart.id === cid);

    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }

    res.status(200).send({ data: cart.products });
});


router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;


    const cart = carts.find(cart => cart.id === cid);

    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado', data: null });
    }


    const product = products.find(product => product.id == pid);

    if (!product) {
        return res.status(404).send({ error: 'Producto no encontrado', data: null });
    }


    const existingProduct = cart.products.find(item => item.product === pid);

    if (existingProduct) {

        existingProduct.quantity += 1;
    } else {
 
        cart.products.push({ product: pid, quantity: 1 });
    }

    res.status(200).send({ error: null, data: cart.products });
});


router.post('/', (req, res) => {
    const maxId = carts.length > 0 ? Math.max(...carts.map(cart => +cart.id)) : 0;
    const newId = maxId + 1;

    const newCart = { id: newId.toString(), products: [] };
    carts.push(newCart);

    res.status(201).send({ error: null, data: newCart });
});

export default router;

