const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Modelo Mongoose para Profissionais
const Professional = mongoose.model('Professional', new mongoose.Schema({
    id: { type: String, required: true, unique: true },  // ID único
    name: { type: String, required: true },              // Nome do profissional
    specialty: { type: String, required: true },         // Especialidade do profissional
    contact: { type: String, required: true },           // Contato do profissional
    phone_number: { type: String, required: true },      // Número de telefone
    status: { type: String, enum: ['on', 'off'], required: true },  // Status do profissional
}));

// Função para gerar um ID único para o profissional (caso não seja fornecido)
function generateProfessionalId() {
    return Math.random().toString(36).substring(2, 10);  // Gera um ID aleatório de 8 caracteres
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - specialty
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID único do profissional
 *         name:
 *           type: string
 *           description: Nome do profissional
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional
 *         contact:
 *           type: string
 *           description: E-mail ou outro meio de contato do profissional
 *         phone_number:
 *           type: string
 *           description: Número de telefone do profissional
 *         status:
 *           type: string
 *           enum: [on, off]
 *           description: Status do profissional (ativo ou inativo)
 *       example:
 *         id: "a1b2c3d4"
 *         name: "Dr. João Silva"
 *         specialty: "Cardiologia"
 *         contact: "dr.joao@exemplo.com"
 *         phone_number: "123456789"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   - name: Professionals
 *     description: Gestão de profissionais
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: Lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 */

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do profissional
 *     responses:
 *       200:
 *         description: Profissional encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       400:
 *         description: Erro ao criar profissional (ID já em uso)
 */

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza os dados de um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Deleta o profissional através do ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do profissional
 *     responses:
 *       200:
 *         description: Profissional deletado com sucesso
 *       404:
 *         description: Profissional não encontrado
 */

router.get('/', async (req, res) => {
    try {
        const professionals = await Professional.find(); // Carregar todos os profissionais
        res.json(professionals);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissionais' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const professional = await Professional.findOne({ id: req.params.id }); // Procurar profissional por ID
        if (!professional) return res.status(404).json({ error: 'Profissional não encontrado' });
        res.json(professional);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissional' });
    }
});

router.post('/', async (req, res) => {
    const { id, name, specialty, contact, phone_number, status } = req.body;

    try {
        const existingProfessional = await Professional.findOne({ id });
        if (existingProfessional) return res.status(400).json({ error: 'O ID do profissional já está em uso' });

        const finalProfessionalId = id || generateProfessionalId();

        const professional = new Professional({
            id: finalProfessionalId,
            name,
            specialty,
            contact,
            phone_number,
            status,
        });

        await professional.save();
        res.status(201).json(professional);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar profissional', details: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { name, specialty, contact, phone_number, status } = req.body;

    try {
        const professional = await Professional.findOne({ id: req.params.id });
        if (!professional) return res.status(404).json({ error: 'Profissional não encontrado' });

        professional.name = name || professional.name;
        professional.specialty = specialty || professional.specialty;
        professional.contact = contact || professional.contact;
        professional.phone_number = phone_number || professional.phone_number;
        professional.status = status || professional.status;

        await professional.save();
        res.json(professional);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar profissional', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const professional = await Professional.findOneAndDelete({ id: req.params.id });
        if (!professional) return res.status(404).json({ error: 'Profissional não encontrado' });
        res.json({ message: 'Profissional deletado com sucesso', professional });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar profissional' });
    }
});

module.exports = router;
