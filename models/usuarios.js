import dbClient from "../config/dbClient.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb"; // Importar ObjectId desde el cliente de MongoDB


class usuariosModel{

   constructor(){
    if (!dbClient.db) {
        throw new Error("Error: La base de datos no está conectada");
    }
    this.colUsuarios = dbClient.db.collection('usuarios');
   }

   validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
   }

   validatePassword(password){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
   }

   async create(usuario){
    //validar campos requeridos
    const camposRequeridos =[
        'nombre',
        'documento',
        'telefono',
        'direccion',
        'correo',
        'nombre_usuario',
        'contraseña',
        'id_rol'
    ];

    for (const campo of camposRequeridos){
        if(!usuario[campo]){
            throw new Error(`falta el campo requerido: ${campo}`);
        }
    }

    // se valida que id_rol sea un objId valido
    if(!ObjectId.isValid(usuario.id_rol)){
        throw new Error('ID de rol invalido');
    }

    // validar formato de correo
    if(!this.validateEmail(usuario.correo)){
        throw new Error('formato de correo electronico invalido');
    }

    //validar contraseña
    if(!this.validatePassword(usuario.contraseña)){
        throw Error('La contraseña debe tener almenos 8 caracteres, una mayuscula, una minuscula y un numero');
    }

    // verificar duplicados
    const [correoExistente, usuarioExistente] = await Promise.all([
        this.colUsuarios.findOne({correo: usuario.correo}),
        this.colUsuarios.findOne({nombre_usuario:usuario.nombre_usuario })
    ]);

    if(correoExistente) throw new Error('correo electronico ya registrado');
    if(usuarioExistente) throw new Error('Nombre de usuario ya registrado');

    //encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(usuario.contraseña, salt);
    
    const nuevoUsuario ={
        ...usuario,
        id_rol: new ObjectId(usuario.id_rol), //combertir en objectId
        contraseña: contraseñaEncriptada,
        fechaRegistro: new Date(),
        ultimaActualizacion: new Date(),
        activo: true
    };

    await this.colUsuarios.insertOne(nuevoUsuario);
    const {contraseña, ...usuarioSinContraseña} =nuevoUsuario;
    return usuarioSinContraseña;
   }

   async update(id, datosActualizacion){
    // evitar actualizacion de campos sencibles directamente
    const {contraseña, correo, nombre_usuario,id_rol, ...datosPermitidos}= datosActualizacion;

    // si se intenta actualizar el rol, validar que sea un objecId valido
    if (id_rol){
        if(!ObjectId.isValid(id_rol)){
            throw new Error('ID de rol invalido');
        }
        datosPermitidos.id_rol = new ObjectId(id_rol); 
    }

    if (correo || nombre_usuario){
        if (correo){
            if (!this.validateEmail(correo)){
                throw new Error ('formato de correo electronico invalido');
            }
            const correoExistente = await this.colUsuarios.findOne({
                correo,
                _id: {$ne: new ObjectId(id)}
            });
            if (correoExistente) throw new Error('correo elctronico ya registrado');
            datosPermitidos.correo = correo;
        }
        if(nombre_usuario){
            const usuarioExistente = await this.colUsuarios.findOne({
                nombre_usuario,
                _id: {$ne: new ObjectId(id)}
            });
            if (usuarioExistente) throw new Error('Nombre de usuario ya registrado');
            datosPermitidos.nombre_usuario = nombre_usuario;
        }
    }
    datosPermitidos.ultimaActualizacion = new Date();

    const resultado = await this.colUsuarios.findOneAndUpdate(
        {_id: new ObjectId(di)},
        {$set: datosPermitidos},
        {returnDocument: 'after'}
    );
    if (!resultado) throw new Error('usuario no encontrado');
    return resultado;

   }

   async authenticate(nombre_usuario, contraseña){
    const usuario = await this.colUsuarios.findOne({
        nombre_usuario,
        activo: true
    });

    if (!usuario) throw new Error('Usuario no encontrado o inactivo');

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if(!contraseñaValida) throw new Error('Contraseña incorrecta');

const token = jwt.sign(
    {
        id: usuario._id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        id_rol: usuario.id_rol // incluimos la referencia al ol en el token
    },
    process.env.JWT_SECRET,
    {expiresIn: '1h'}
);

const {contraseña: _, ...usuarioSinContraseña}=usuario;
return {usuario: usuarioSinContraseña, token};
   }
   
   // Método opcional para obtener usuario con información del rol
   async getOneWithRole(id) {
    return await this.colUsuarios.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: 'Roles', // Nombre de tu colección de roles
                localField: 'id_rol',
                foreignField: '_id',
                as: 'rol'
            }
        },
        { $unwind: '$rol' },
        { $project: { contraseña: 0 } }
    ]).next();
}
}
export default new usuariosModel();