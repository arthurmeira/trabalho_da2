const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Definindo o esquema do professor
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  school_disciplines: { type: String, required: true },
  contact: { type: String, required: true },
  phone_number: { type: String, required: true },
  status: { type: String, required: true }
});

// Criando o modelo do professor
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do professor
 *         name:
 *           type: string
 *           description: Nome do professor
 *         school_disciplines:
 *           type: string
 *           description: Disciplinas que o professor leciona
 *         contact:
 *           type: string
 *           description: E-mail de contato do professor
 *         phone_number:
 *           type: string
 *           description: Número de telefone do professor
 *         status:
 *           type: string
 *           description: Status do professor (ativo/inativo)
 *       example:
 *         name: "Maria Silva"
 *         school_disciplines: "Matemática"
 *         contact: "maria@exemplo.com"
 *         phone_number: "123456789"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   - name: Teachers
 *     description: Gestão de professores
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();  // Carregar os professores do MongoDB
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar professores' });
    }
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Retorna os dados do professor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Professor não encontrado' });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar professor' });
    }
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 */
router.post('/', async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar professor', details: error.message });
    }
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza os dados de um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.put('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!teacher) return res.status(404).json({ error: 'Professor não encontrado' });
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar professor', details: error.message });
    }
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Deleta um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Professor não encontrado' });
        res.json({ message: 'Professor deletado com sucesso', teacher });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar professor' });
    }
});

module.exports = router;
