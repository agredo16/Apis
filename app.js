import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';//para mejorar la seguridad de las cabeceras  HTTP
import routesusuarios from './routes/usuarios.js'
import dbClient from './config/dbClient.js';


const app = express();

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(helmet()); // Añade cabeceras de ceguridad
app.use(express.json()); //Permite que la aplicacion analice el cuerpo de las solicitudes  en formato JSON

dbClient.conectarDB();

app.use('/usuarios', routesusuarios);
// Middleware de manejo de errores
app.use((err, req, res, )=>{
    console.error(err.stack); // Registra el error en la consola
    res.status(500).json({error: 'Algo salio mal!'});
})

try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`Servidor activo en el puerto ${PORT}`))
} catch (e){
    console.log(e);

}