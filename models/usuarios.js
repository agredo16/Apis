import dbClient from "../config/dbClient.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb"; // Importar ObjectId desde el cliente de MongoDB


class usuariosModel{

    async create(usuario){
        const colUsuarios = dbClient.db.collection('Usuarios');

            // Validar que todos los campos necesarios estén presentes
            const camposRequeridos = ['nombre', 'documento', 'telefono', 'direccion', 'correo', 'nombre_usuario', 'contraseña'];
            for (const campo of camposRequeridos) {
                if (!usuario[campo]) {
                    throw new Error(`Falta el campo requerido: ${campo}`);
                }
            }
        //verificar ssi el correo electronico ya esta registrado
        const correoExistente = await colUsuarios.findOne({correo: usuario.correo});

        if(correoExistente){
            throw new Error('Correo electronico ya registrado');
        }

        //verificar si el nombre de usuario ya esta registrado
        const usuarioExistente = await colUsuarios.findOne({nombre_usuario:usuario.nombre_usuario});
        
        if(usuarioExistente){
            throw new Error('El nombre de usuario ya esta registrado');
        }
        
        //encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(usuario.contraseña,salt);
        
        // Crea un nuevo objeto de usuario con la contraseña encriptada y la fecha de registro
        const nuevoUsuario = {
            ...usuario, // Copia todas las propiedades del usuario
            contraseña: contraseñaEncriptada, // Sobrescribe la contraseña con la versión encriptada
            fechaRegistro: new Date() // Agrega la fecha de registro
        };
         // Inserta el nuevo usuario en la colección
        await colUsuarios.insertOne(nuevoUsuario)
        return nuevoUsuario;
    }

    //Actualizar usuario
    async update(id, usuario){
        const colUsuarios = dbClient.db.collection('Usuarios');
        //Actualiza al usuario con el id proporcionado
        const result = await colUsuarios.updateOne({_id: new ObjectId(id)}, {$set: usuario});
        return result;
    }

    //Eliminar usuario
    async delete(id){
        const colUsuarios = dbClient.db.collection('Usuarios');
        await colUsuarios.deleteOne({_id: new ObjectId(id)});
    }

    //Obtener todos los usuarios
    async getAll(){
        const colUsuarios = dbClient.db.collection('Usuarios');
        return await colUsuarios.find({}).toArray();
        }

        // Obtener usuario por id
        async getOne(id){
            const colUsuarios = dbClient.db.collection('Usuarios');
            return await colUsuarios.findOne({_id: new ObjectId(id)});
        }
    async findByEmail(correo){
        const colUsuarios = dbClient.db.collection('Usuarios');
        return await colUsuarios.findOne({correo});
    }
    async findByUsername(nombre_usuario){
        const colUsuarios = dbClient.db.collection('Usuarios');
        return await colUsuarios.findOne({nombre_usuario});
    }


    async authenticate(nombre_usuario, contraseña) {
        const colUsuarios = dbClient.db.collection('Usuarios');
        const usuario = await colUsuarios.findOne({ nombre_usuario });

        if (!usuario) {
            throw new Error('Nombre de usuario no encontrado');
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            throw new Error('Contraseña incorrecta');
        }
        // Generar un token JWT
    const token = jwt.sign(
        { id: usuario._id },
         process.env.JWT_SECRET
         , { expiresIn: '1h' }
        );

        // Devuelve el usuario sin la contraseña
        const { contraseña: _, ...usuarioSinContraseña } = usuario;
        return usuarioSinContraseña, token;
    }
}
export default new usuariosModel();