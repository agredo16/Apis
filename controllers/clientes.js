import Cliente from "../models/cliente.js";  

const clientesController = {
    async create(req, res) {
        try {
            const nuevoCliente = new Cliente(req.body);
            await nuevoCliente.save();
            res.status(201).json(nuevoCliente);
        } catch (error) {
            res.status(500).json({ error: "Error al crear cliente" });
        }
    },

    async getAll(_req, res) {
        try {
            const clientes = await Cliente.find();  
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener clientes" });
        }
    },

    async getById(req, res) {
        try {
            const cliente = await Cliente.findById(req.params.id);
            if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
            res.json(cliente);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener cliente" });
        }
    },

    async update(req, res) {
        try {
            const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
            res.json(cliente);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar cliente" });
        }
    },

    async delete(req, res) {
        try {
            const cliente = await Cliente.findByIdAndDelete(req.params.id);
            if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
            res.json({ message: "Cliente eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar cliente" });
        }
    }
};

export default clientesController;  // ✅ Se exporta con otro nombre para evitar conflicto
