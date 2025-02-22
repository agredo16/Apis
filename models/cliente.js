import { getDB } from "../config/dbClient.js";
import { ObjectId } from "mongodb";

class ClientesModel {
    constructor() {
        this.colClientes = null;
    }

    // Inicializar la colección de clientes
    async init() {
        const db = await getDB();
        this.colClientes = db.collection("clientes");
        console.log("✅ Colección de clientes inicializada correctamente");
    }

    // Crear un nuevo cliente
    async create(cliente) {
        const camposRequeridos = ["nombre", "documento", "telefono", "direccion", "correo"];

        // Validar campos requeridos
        for (const campo of camposRequeridos) {
            if (!cliente[campo]) {
                throw new Error(`Falta el campo requerido: ${campo}`);
            }
        }

        // Validar que el correo sea único
        const correoExistente = await this.colClientes.findOne({ correo: cliente.correo });
        if (correoExistente) {
            throw new Error("El correo electrónico ya está registrado");
        }

        // Insertar el nuevo cliente
        const nuevoCliente = {
            ...cliente,
            fechaRegistro: new Date(),
            activo: true
        };

        await this.colClientes.insertOne(nuevoCliente);
        return nuevoCliente;
    }

    // Obtener todos los clientes
    async findAll() {
        return await this.colClientes.find({}).toArray();
    }

    // Obtener un cliente por ID
    async findById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID de cliente inválido");
        }
        return await this.colClientes.findOne({ _id: new ObjectId(id) });
    }

    // Actualizar un cliente
    async update(id, datosActualizados) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID de cliente inválido");
        }

        const resultado = await this.colClientes.updateOne(
            { _id: new ObjectId(id) },
            { $set: datosActualizados }
        );

        if (resultado.modifiedCount === 0) {
            throw new Error("No se encontró el cliente o no se realizaron cambios");
        }

        return await this.findById(id);
    }

    // Eliminar un cliente (borrado lógico)
    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID de cliente inválido");
        }

        const resultado = await this.colClientes.updateOne(
            { _id: new ObjectId(id) },
            { $set: { activo: false } }
        );

        if (resultado.modifiedCount === 0) {
            throw new Error("No se encontró el cliente o no se realizaron cambios");
        }

        return { message: "Cliente desactivado correctamente" };
    }
}

// Crear una instancia del modelo y asegurarse de que se inicialice correctamente
const clientesModel = new ClientesModel();
clientesModel.init().then(() => {
    console.log("✅ Modelo de clientes listo");
}).catch((error) => {
    console.error("❌ Error al inicializar el modelo de clientes:", error);
});

export default clientesModel;