/*Import express*/
import express from 'express';
/*Import modulo propio*/
import {Producto} from '../modelo.js';

const router = express.Router();

/*Declaración de producto para manejo del array de producto en memoria y creación de instancia 
de la clase Producto importada del módulo*/
let productos = [];
let prod = new Producto();

/*Listado general de productos*/
router.get('/productos/listar', (req, res) => {

    productos = prod.listar(productos);
    
    if(productos.length===0){
        res.json({
            error: 'No hay productos cargados', 
        });
    }else{
        res.json({
            productos,
        });
    }
});

/*Listado general de productos por ID*/
router.get('/productos/listar/:id', (req, res) => {
    //const prod = new Producto();
    const itemId = prod.listarItem(productos, req.params.id);

    if (JSON.stringify(itemId)=='{}'){
        res.json({
            error: 'Producto no encontrado', 
        });
    }else{
        res.json({
            itemId,
        });
    }
});

/*Inserción de nuevo objeto en array productos*/
router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.post('/productos/guardar/', (req, res) => {
    
    const body = req.body;

    console.log(body);

    let price = 0;

    price = parseFloat(body.price);
    console.log(typeof price);
    if(
        !body.title ||
        !body.thumbnail ||
        /*!body.price*/ //price ||
        typeof body.title != 'string' ||
        typeof body.thumbnail != 'string' ||
        typeof /*body.price*/price != 'number'
        ){
            return res.status(400).json({
                msg: 'Se necesitan los datos title, thumbnail y price',
            });
        }
    
    const prod = new Producto(body.title, /*body.price*/price, body.thumbnail, productos.length);
    //prod.(body.title, body.price, body.thumbnail, productos.length);
    productos = prod.guardar(productos);

    res.status =201;
    res.json({
        data: productos[productos.length-1],
    })
});

/*Actualización de un objeto en array productos*/
router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.put('/productos/actualizar/:id', (req, res) => {
    
    const body = req.body;

    console.log(req.body);
    
    if(
        !body.title ||
        !body.thumbnail ||
        !body.price ||        
        typeof body.title != 'string' ||
        typeof body.thumbnail != 'string' ||
        typeof body.price != 'number'
        ){
            return res.status(400).json({
                msg: 'Se necesitan los datos title, thumbnail y price',
            });
        }

    const actItem = prod.actualizar(productos, req.params.id, body.title, body.price, body.thumbnail);
    
    res.status =200;
    res.json({
        actItem,
    })

});

/*Borrado de un objeto en array productos*/
router.delete('/productos/borrar/:id', (req, res) => {
    
    const borrItem = prod.borrar(productos, req.params.id);

    res.status =200;
    res.json({
        borrItem,
    })

});

export default router;