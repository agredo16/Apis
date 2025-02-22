import express from "express";
import usuarios from "../controllers/usuarios.js";

const router = express.Router();

router.post("/registro", usuarios.create);
router.post("/login", usuarios.login);  // 🔹 Nueva ruta de login
router.get("/", usuarios.getAll);
router.get("/:id", usuarios.getById);
router.put("/:id", usuarios.update);
router.delete("/:id", usuarios.delete);

export default router;
