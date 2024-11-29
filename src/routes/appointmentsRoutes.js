const express = require('express');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const router = express.Router();

// Modelo Mongoose para Compromissos
const Appointment = mongoose.model('Appointment', new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    specialty: { type: String, required: true },
    comments: { type: String, required: true },
    date: { type: Date, required: true },
    student: { type: String, required: true },
    professional: { type: String, required: true },
}));

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - id
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         id:
 *           type: string
 *           description: ID do compromisso
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional
 *         comments:
 *           type: string
 *           description: Comentários sobre o compromisso
 *         date:
 *           type: string
 *           description: Data e hora do compromisso
 *         student:
 *           type: string
 *           description: Nome do estudante
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *       example:
 *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         specialty: "Fisioterapeuta"
 *         comments: "Realizar sessão"
 *         date: "2023-08-15 16:00:00"
 *         student: "Bingo Heeler"
 *         professional: "Winton Blake"
 */

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Gestão de compromissos
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna uma lista de todos os compromissos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A lista de compromissos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar compromissos', details: error.message });
    }
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um compromisso pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do compromisso
 *     responses:
 *       200:
 *         description: Retorna os dados do compromisso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Compromisso não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ id: req.params.id });
        if (!appointment) return res.status(404).json({ error: 'Compromisso não encontrado' });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar compromisso', details: error.message });
    }
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo compromisso
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: O compromisso foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */
router.post('/', async (req, res) => {
    const { specialty, comments, date, student, professional } = req.body;

    if (!specialty || !comments || !date || !student || !professional) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newAppointment = new Appointment({
        id: uuidv4(),
        specialty,
        comments,
        date: new Date(date),
        student,
        professional
    });

    try {
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar compromisso', details: error.message });
    }
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza os dados de um compromisso pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do compromisso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: O compromisso foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Compromisso não encontrado
 */
router.put('/:id', async (req, res) => {
    const { specialty, comments, date, student, professional } = req.body;

    if (!specialty || !comments || !date || !student || !professional) {
        return res.status(400).json({ error: 'Todos os campos devem ser preenchidos.' });
    }

    try {
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { id: req.params.id },
            { specialty, comments, date: new Date(date), student, professional },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Compromisso não encontrado' });
        }

        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar compromisso', details: error.message });
    }
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Deleta um compromisso pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do compromisso
 *     responses:
 *       200:
 *         description: O compromisso foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Compromisso não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findOneAndDelete({ id: req.params.id });
        if (!deletedAppointment) {
            return res.status(404).json({ error: 'Compromisso não encontrado' });
        }
        res.json(deletedAppointment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar compromisso', details: error.message });
    }
});

module.exports = router;
