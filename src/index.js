/*Imports*/
import express, { request, response } from 'express';
import path from 'path';
import * as http from 'http';
import io from 'socket.io';
import {Producto} from './modelo';
import { initWsServer } from './services/socket';
import { productsController } from './controllers/producto';
import recurso1Router from './routes/recurso1';
import apiRouter from './routes/apiRouter';
import logOutRouter from './routes/logout';
import logInRouter from './routes/login';
import session from 'express-session';
import { render } from 'pug';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import Config from './config/index'
import { connectDb } from './services/dbMongoAtlas';
import passport from 'passport';
import regUserRouter from './routes/register';
import { isLoggedIn } from './middlewares/auth';
import { calculo } from './utils/randoms';
import { fork } from 'child_process';
import cluster from 'cluster';
import os from 'os';
import compression from 'compression';
import log4js from 'log4js';
import { PORT } from '..';
//import logger from './services/logs';

log4js.configure({
  appenders: {
    loggerWarn: { type: 'file', filename: './logs/warn.log' },
    loggerError: { type: 'file', filename: './logs/error.log' },
    loggerConsole: { type: 'console' },
  },
  categories: {
    default: { appenders: ['loggerConsole'], level: 'info' },
    fileWarn: { appenders: ['loggerWarn', 'loggerConsole'], level: 'warn' },
    fileError: { appenders: ['loggerError', 'loggerConsole'], level: 'error' },
  },
});

const logger = log4js.getLogger('loggerConsole');
const loggerE = log4js.getLogger('fileError');
const loggerW = log4js.getLogger('fileWarn');

//logger.level = 'warn';

const argumentos = process.argv;
const scriptPath = path.resolve(__dirname, './utils/randoms.js');

connectDb().then(() => {
  //console.log('DB CONECTADA');
  logger.info('DB CONECTADA');
});

/*Declaración puerto y app*/
//const puerto = argumentos[2]|| 8080;
const mode = argumentos[5]|| 'FORK';
const numCPUs = os.cpus().length;
const app = express();

app.use(compression());

app.use(express.json());

app.use(
  session({
    secret: 'your secret line of secretness',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

const layoutFolderPath = path.resolve(__dirname, '../views/layouts'); 
const defaultLayerPath = path.resolve(__dirname, '../views/layouts/index.handlebars');

const appServer = http.Server(app);

const appWSServer = initWsServer(appServer);


if (mode == 'CLUSTER' && cluster.isMaster) {
  //console.log(`NUMERO DE CPUS ===> ${numCPUs}`);
 //console.log(`PID MASTER ${process.pid}`);
 logger.info(`NUMERO DE CPUS ===> ${numCPUs}`);
 logger.info(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    logger.info(`Worker ${worker.process.pid} died at ${Date()}`);
    //console.log(`Worker ${worker.process.pid} died at ${Date()}`);
    cluster.fork();
  });
} else {
  /* --------------------------------------------------------------------------- */
  /* WORKERS */
  //const PORT = 8080;

  appServer.listen(PORT, () =>
    /*console.log(
      `Servidor express escuchando en el puerto ${puerto} - PID WORKER ${process.pid}`
    )*/
    logger.info(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
  );
}
//appServer.listen(puerto, () => console.log('Server UP en puerto', puerto));
/*logger.info('Imprimimos Info');
logger.warn('Imprimimos Warn');
logger.error('Imprimimos Error');*/
logger.info('Imprimimos Info 1');
loggerW.warn('Imprimimos Warn 1');
loggerE.error('Imprimimos Error 1');

app.get('/randoms', (req, res) => {
   let cantidad = req.params.cant;
  const computo = fork(scriptPath);
  computo.send('start');
  computo.on('message', (obj) => {
    res.json({
      resultado: obj,
    });
  });
});

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/info', (req, res) => {
 console.log('Inicio Info');
let args = argumentos;
let plataforma = process.platform;
let version = process.version;
let usoMemoria = JSON.stringify(process.memoryUsage());
let pathEjecucion = process.cwd();
let idProceso = process.pid;
const publicPath = `${process.cwd()}/public`;
let carpetaCorriente = publicPath;
let facebookClientId = argumentos[3];
let facebookClientSecret = argumentos[4];
console.log('Fin Info');
  res.render('datos', {args, 
                      plataforma,
                      version,
                      usoMemoria,
                      pathEjecucion,
                      idProceso, 
                      publicPath,
                      carpetaCorriente,
                      numCPUs});
});

app.use('/api',apiRouter);

app.get('/login', (req, res) => {
  res.render('login');
});

app.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/datos',
    failureRedirect: '/fail',
  })
);

app.get('/datos', (req, res) => {
  let foto = 'noPhoto';
  let email = 'noEmail';

  if (req.isAuthenticated()) {
    const userData = req.user;
    //reinicio contador
    if (!userData.contador) userData.contador = 0;
    userData.contador++;

    if (userData.photos) foto = userData.photos[0].value;

    if (userData.emails) email = userData.emails[0].value;

    res.render('altaPug', {
      nombre: userData.displayName,
      contador: userData.contador,
      foto,
      email,
    });
  } else {
    res.redirect('/api/login');
  }
});



/*Route LogOut*/
app.use('/logout',logOutRouter);

/*Route Register*/
//app.use('/register',regUserRouter);

/*app.get('/registerError', (req, res) => {
  res.render('registerError');
});*/

/*Route test-view*/
app.use('/vista-test',recurso1Router);

/*Desde Acá router*/
/*Declaración de producto para manejo del array de producto en memoria y creación de instancia 
de la clase Producto importada del módulo*/
let productos = [];
let prod = new Producto();

/*Listado general de productos*/
app.get('/listar', productsController.getProducts);/*(req, res) => {


/*Listado general de productos por ID*/
app.get('/listar/:id', productsController.getProducts);/*(req, res) => {


/*Inserción de nuevo objeto en array productos*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.post('/guardar/', (req, res) => {
    
    const body = req.body;

    let price = 0;

    price = parseFloat(body.price);

    if(
        !body.title ||
        !body.thumbnail ||
        typeof body.title != 'string' ||
        typeof body.thumbnail != 'string' ||
        typeof price != 'number'
        ){
          loggerW.warn('Se necesitan los datos title, thumbnail y price');
            return res.status(400).json({
                msg: 'Se necesitan los datos title, thumbnail y price',
            });
        }
    
    const prod = new Producto(body.title, price, body.thumbnail, productos.length);

    productos = prod.guardar(productos);

    res.status =201;
    res.json({
        data: productos[productos.length-1],
    })
});

/*Actualización de un objeto en array productos*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.put('/actualizar/:id', (req, res) => {
    
    const body = req.body;

    console.log(req.body);

    const actItem = prod.actualizar(productos, req.params.id, body.title, body.precio, body.thumbnail);
    
    res.status =200;
    res.json({
        actItem,
    })

});

/*Borrado de un objeto en array productos*/
app.delete('/borrar/:id', (req, res) => {
    
    const borrItem = prod.borrar(productos, req.params.id);

    res.status =200;
    res.json({
        borrItem,
    })

});

/*Vista de productos*/
app.get('/vista', (req, res) => {

    const cantidad = productos.length;

    let existe;
    if (cantidad > 0)
         existe = true;
    else
        existe = false;   

    const datosProductos = {
    nombre:'Productos',
    hayProductos: existe,
    listaProductos: productos};

    res.render('vistaPug', datosProductos);
});

app.get('/', isLoggedIn, (req, res) => {
 res.render('altaPug');
});


let messages = [];

appWSServer.on('connection', function (socket) {
    /*console.log('\n\nUn cliente se ha conectado');
    console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
    console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);*/
    logger.info('\n\nUn cliente se ha conectado');
    logger.info(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
    logger.info(`ID DEL SOCKET DEL SERVER => ${socket.id}`);
  
    socket.on('new-message', function (data) {
     // console.log('Datos in', data);
      const prod = new Producto(data.tit, data.pri, data.thu, productos.length);
      productos = prod.guardar(productos);

      //console.log('data', data);
      const newMessage = {
        socketId: socket.client.id,
        message: data,
      };

      messages.push(data);

      //console.log('messages', messages);
  
      //PARA RESPONDERLE A UN SOLO CLIENTE
      // socket.emit('messages', messages);
  
      //PARA ENVIARLE EL MENSAJE A TODOS
      appWSServer.emit('messages', messages);
  
      //PARA ENVIARLE MENSAJE A TODOS MENOS AL QUE ME LO MANDO
      // socket.broadcast.emit('messages', messages);
    });
  
    socket.on('askData', (data) => {
      console.log('ME LLEGO DATA', data);
      const obj = {
        tit: "Nombre",
        pri: "Precio",
        thu: "Foto"};

      if (messages.length==0){
        messages.push(obj);  
      };
      socket.emit('messages', messages);
    });
  });