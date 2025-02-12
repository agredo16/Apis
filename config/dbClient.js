import 'dotenv/config';
import { MongoClient } from "mongodb";

class dbClient {
    constructor() {
        const queryString =`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/?retryWrites=true&w=majority&appName=laboratorio`;
        this.client = new MongoClient(queryString);


    }
    async conectarDB(){
        try{
           await this.client.connect();
           this.db = this.client.db('registroUsuarios');
           console.log("Conectado al servidor de base de datos");
        } catch (e){
            console.log(e);
        }
    }
}
export default new dbClient();