import express from 'express';
const route = express.Router();
import usuarioController  from '../controllers/usuarios.js';

route.post('/', usuarioController.create);
route.get('/:id', usuarioController.getOne);
route.get('/', usuarioController.getAll);
route.put('/:id', usuarioController.update);
route.delete('/:id', usuarioController.delete);
route.post('/login', usuarioController.login); // Ruta para el login
export default route; 