import usuariosModel from '../models/usuarios.js';

class usuariosController{
    constructor(){

    }

   async create(req,res){
        try{
            const data = await usuariosModel.create(req.body);

            res.status(201).json(data);

        }catch(e){
            res.status(500).send(e);
        }
    }

    async update(req,res){
        try{
            const {id} = req.params;
            const data = await usuariosModel.update(id, req.body);
            res.status(200).json(data);

        }catch(e){
            res.status(500).send(e);
        }
    }

    async delete(req,res){
        try{
            const {id} = req.params;
            await usuariosModel.delete(id);
            res.status(204).send();

        }catch(e){
            res.status(500).send(e);
        }
    }

    async getAll(req,res){
        try{
            const data = await usuariosModel.getAll();
            res.status(200).json(data);

        }catch(e){
            res.status(500).send(e);
        }
    }

    async getOne(req,res){
        try{
            const {id} = req.params;
            const data = await usuariosModel.getOne(id);
            res.status(200).json(data);

        }catch(e){
            res.status(500).send(e);
        }
    }

    async login(req, res) {
        try {
            const { nombre_usuario, contraseña } = req.body;
            const {usuario, token} = await usuariosModel.authenticate(nombre_usuario, contraseña);
            res.status(200).json({usuario,token});
        } catch (e) {
            res.status(401).json({ error: e.message });
        }
    }
}
export default new usuariosController();