import { getDB } from "../config/dbClient.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

class UsuariosModel {
    constructor() {
        // No inicializamos this.colUsuarios aquí, ya que `db` no está listo todavía
        this.colUsuarios = null;
    }

    // Método para inicializar la conexión a la colección
    async init() {
        const db = await getDB(); // Espera a que la conexión esté lista
        this.colUsuarios = db.collection("Usuarios");
        console.log("Colección de usuarios inicializada correctamente");
    }

    // Validar formato de correo electrónico
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar formato de contraseña
    validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    // Crear un nuevo usuario
    async create(usuario) {
        // Campos requeridos
        const camposRequeridos = [
            "nombre",
            "documento",
            "telefono",
            "direccion",
            "correo",
            "nombre_usuario",
            "contraseña",
            "id_rol"
        ];

        // Verificar que todos los campos requeridos estén presentes
        for (const campo of camposRequeridos) {
            if (!usuario[campo]) {
                throw new Error(`Falta el campo requerido: ${campo}`);
            }
        }

        // Validar el ID de rol
        if (!ObjectId.isValid(usuario.id_rol)) {
            throw new Error("ID de rol inválido");
        }

        // Validar el formato del correo electrónico
        if (!this.validateEmail(usuario.correo)) {
            throw new Error("Formato de correo electrónico inválido");
        }

        // Validar el formato de la contraseña
        if (!this.validatePassword(usuario.contraseña)) {
            throw new Error("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
        }

        // Verificar si el correo o el nombre de usuario ya existen
        const [correoExistente, usuarioExistente] = await Promise.all([
            this.colUsuarios.findOne({ correo: usuario.correo }),
            this.colUsuarios.findOne({ nombre_usuario: usuario.nombre_usuario })
        ]);

        if (correoExistente) throw new Error("Correo electrónico ya registrado");
        if (usuarioExistente) throw new Error("Nombre de usuario ya registrado");

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(usuario.contraseña, salt);

        // Crear el nuevo usuario
        const nuevoUsuario = {
            ...usuario,
            id_rol: new ObjectId(usuario.id_rol), // Convertir a ObjectId
            contraseña: contraseñaEncriptada, // Guardar la contraseña encriptada
            fechaRegistro: new Date(), // Fecha de registro
            ultimaActualizacion: new Date(), // Fecha de última actualización
            activo: true // Estado del usuario
        };

        // Insertar el nuevo usuario en la colección
        await this.colUsuarios.insertOne(nuevoUsuario);

        // Eliminar la contraseña del objeto de retorno por seguridad
        const { contraseña, ...usuarioSinContraseña } = nuevoUsuario;
        return usuarioSinContraseña;
    }
}

// Crear una instancia del modelo y asegurarse de que se inicialice correctamente
const usuariosModel = new UsuariosModel();
usuariosModel.init().then(() => {
    console.log("Modelo de usuarios inicializado correctamente");
}).catch((error) => {
    console.error("Error al inicializar el modelo de usuarios:", error);
});

export default usuariosModel;