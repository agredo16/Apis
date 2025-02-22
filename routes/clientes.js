import express from "express";
import clientes from "../controllers/clientes.js";

const router = express.Router();

router.post("/", clientes.create);      
router.get("/", clientes.getAll);      
router.get("/:id", clientes.getById);   
router.put("/:id", clientes.update);    
router.delete("/:id", clientes.delete); 

export default router;
