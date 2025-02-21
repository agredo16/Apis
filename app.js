import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dbClient from './config/dbClient.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Ruta raíz
app.get('/', (_req, res) => {  
    res.send('¡Bienvenido a mi API!');
});

// **Esperar conexión antes de cargar las rutas**
async function startServer() {
    try {
        await dbClient.conectarDB(); // Espera la conexión antes de cargar las rutas
        console.log("✅ Base de datos conectada con éxito.");

        // Cargar rutas solo después de la conexión exitosa
        const routesusuarios = (await import('./routes/usuarios.js')).default;
        const routesclientes = (await import('./routes/clientes.js')).default;

        app.use('/usuarios', routesusuarios);
        app.use('/clientes', routesclientes);

        // Middleware de manejo de errores
        app.use((err, _req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Algo salió mal!' });
        });

        // Iniciar servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => 
            console.log(`🚀 Servidor activo en el puerto ${PORT}`)
        );

    } catch (e) {
        console.error("❌ Error al iniciar el servidor:", e);
        process.exit(1); // Detener la ejecución si hay un error crítico
    }
}

// Llamar la función para iniciar el servidor
startServer();
