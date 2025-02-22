import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { conectarDB } from "./config/dbClient.js"; // Importamos conectarDB y getDB
import clientes from "./routes/clientes.js";
import usuarios from "./routes/usuarios.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos antes de iniciar el servidor
conectarDB()
    .then(() => {
        console.log("✅ Conectado a MongoDB correctamente");

        // Rutas
        app.use("/clientes", clientes);
        app.use("/usuarios", usuarios);

        // Iniciar el servidor
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ No se pudo conectar a MongoDB:", error);
        process.exit(1); // Detener la aplicación si no se puede conectar a la base de datos
    });