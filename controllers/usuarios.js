import Usuario from "../models/usuarios.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import dotenv from "dotenv";

dotenv.config(); 

const usuarios = {
    async create(req, res) {
        try {
            const { nombre, correo, contraseña } = req.body;

           
            const salt = await bcrypt.genSalt(10);
            const hashContraseña = await bcrypt.hash(contraseña, salt);

            const nuevoUsuario = new Usuario({ nombre, correo, contraseña: hashContraseña });
            await nuevoUsuario.save();

            res.status(201).json({ mensaje: "Usuario registrado con éxito" });
        } catch (error) {
            res.status(500).json({ error: "Error al crear usuario" });
        }
    },

    async getAll(_req, res) {
        try {
            const usuarios = await Usuario.find().select("-contraseña");
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener usuarios" });
        }
    },

    async getById(req, res) {
        try {
            const usuario = await Usuario.findById(req.params.id).select("-contraseña");
            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener usuario" });
        }
    },

    async update(req, res) {
        try {
            const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!usuarioActualizado) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json(usuarioActualizado);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar usuario" });
        }
    },

    async delete(req, res) {
        try {
            const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
            if (!usuarioEliminado) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json({ mensaje: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar usuario" });
        }
    },

    async login(req, res) {
        try {
            const { correo, contraseña } = req.body;
            const usuario = await Usuario.findOne({ correo });

            if (!usuario) {
                return res.status(401).json({ error: "Credenciales incorrectas" });
            }

            const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
            if (!contraseñaValida) {
                return res.status(401).json({ error: "Credenciales incorrectas" });
            }

   
            const token = jwt.sign(
                { id: usuario._id, correo: usuario.correo },
                process.env.JWT_SECRET, 
                { expiresIn: "1h" }
            );

            res.json({ mensaje: "Login exitoso", token });
        } catch (error) {
            res.status(500).json({ error: "Error en el login" });
        }
    }
};

export default usuarios;
