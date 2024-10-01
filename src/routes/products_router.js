import { Router } from 'express';
import { uploader } from '../uploader.js';

const router = Router();

const products = [
    {id: 1, title: 'Frutilla', description: 'string', code: '1', price: '100', status: true, stock: '90', category: 'frutas', thumbnails: ["https://res.cloudinary.com/dyg0knk2o/image/upload/v1722660748/frutilla_xjbb7r.jpg"]},
];


const auth = (req, res, next) => {
    console.log('Ejecuta el middleware de autenticación de usuario');
    next();
}


router.get('/', (req, res) => {
    res.status(200).send({ data: products });
});


router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find(p => p.id === Number(pid));

    if (product) {
        res.status(200).send({ error: null, data: product });
    } else {
        res.status(404).send({ error: 'Producto no encontrado', data: null });
    }
});


router.post('/', auth, uploader.single('thumbnail'), (req, res) => {
    const { title, description, stock, category, code, price } = req.body;
    let { status, thumbnails } = req.body;

    if (!title || !description || !stock || !category || !code || !price) {
        return res.status(400).send({ error: 'Faltan campos obligatorios', data: null });
    }

    const maxId = products.length > 0 ? Math.max(...products.map(p => +p.id)) : 0;
    const newId = maxId + 1;

    if (status === undefined) {
        status = true;
    }

    thumbnails = thumbnails ? (Array.isArray(thumbnails) ? thumbnails : [thumbnails]) : [];

    const newProduct = {
        id: newId,
        title,
        description,
        status,
        stock: Number(stock),
        category,
        thumbnails,
        code,
        price: Number(price)
    };

    products.push(newProduct);
    
    res.status(201).send({ error: null, data: newProduct, file: req.file });
});


router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const index = products.findIndex(element => element.id === Number(pid));
    
    if (index > -1) {
    
        products[index] = {
            ...products[index], 
            ...req.body 
        };
        res.status(200).send({ error: null, data: products[index] });
    } else {
        res.status(404).send({ error: 'Producto no encontrado', data: [] });
    }
});


router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const index = products.findIndex(element => element.id === Number(pid));
    
    if (index > -1) {
        products.splice(index, 1); 
        res.status(200).send({ error: null, data: 'Producto eliminado' });
    } else {
        res.status(404).send({ error: 'Producto no encontrado', data: [] });
    }
});

export default router;
