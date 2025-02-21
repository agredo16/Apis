import express from 'express';
import clientesController from "../controllers/clientes.js";

const router = express.Router();
router.post("/", clientesController.create); 
router.get("/", clientesController.getAll);   
router.get("/:id", clientesController.getById);  
router.put("/:id", clientesController.update);  
router.delete("/:id", clientesController.delete);  

export default router;