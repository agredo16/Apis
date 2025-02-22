import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function conectarDB() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log("✅ Conectado a MongoDB correctamente");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1); 
    }
}

async function getDB() {
    if (!db) {
        await conectarDB();
    }
    return db;
}

export { conectarDB, getDB };