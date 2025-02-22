import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";

async function testConnection() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ No se encontró MONGO_URI en el archivo .env");
        return;
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("✅ Conexión exitosa a MongoDB");
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error);
    } finally {
        await client.close();
    }
}

testConnection();
