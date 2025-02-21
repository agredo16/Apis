import express from 'express';
import usuarioController  from '../controllers/usuarios.js';

const router = express.Router();

router.post('/', usuarioController.create);
router.get('/:id', usuarioController.getOne);
router.get('/', usuarioController.getAll);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);
router.post('/login', usuarioController.login); // Ruta para el login

export default router; 