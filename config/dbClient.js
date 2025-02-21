import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";

console.log('MONGO_URI en dbClient:', process.env.MONGO_URI);

class dbClient {
    constructor() {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ ERROR: MONGO_URI no está definido");
        }
        this.client = new MongoClient(process.env.MONGO_URI);
    }

    async conectarDB() {
        try {
            await this.client.connect();
            this.db = this.client.db('registroUsuarios');
            console.log("✅ Conectado al servidor de base de datos");
        } catch (e) {
            console.error("❌ Error al conectar a la base de datos:", e);
        }
    }
}

export default new dbClient();
