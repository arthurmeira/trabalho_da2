const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let appointmentsDB = require('../db/appointments.json');

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
 *     description: API para gestão de compromissos (appointments)
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
router.get('/', (req, res) => {
    res.json(appointmentsDB);
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
 *         schema:
 *           type: string
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
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const appointment = appointmentsDB.find(appt => appt.id === id);
    if (!appointment) return res.status(404).json({ "erro": "Compromisso não encontrado" });
    res.json(appointment);
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
router.post('/', (req, res) => {
    const appointment = { id: uuidv4(), ...req.body };

    
    if (!appointment.specialty || !appointment.comments || !appointment.date || !appointment.student || !appointment.professional) {
        return res.status(400).json({ "erro": "Todos os campos são obrigatórios." });
    }

    
    appointmentsDB.push(appointment);
    fs.writeFileSync(path.join(__dirname, '../db/appointments.json'), JSON.stringify(appointmentsDB, null, 2), 'utf8');

    return res.status(201).json(appointment);
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
 *         schema:
 *           type: string
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
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const appointmentIndex = appointmentsDB.findIndex(appt => appt.id === id);

    if (appointmentIndex === -1) {
        return res.status(404).json({ "erro": "Compromisso não encontrado" });
    }

    const updatedAppointment = { ...req.body, id: appointmentsDB[appointmentIndex].id };

    if (!updatedAppointment.specialty || !updatedAppointment.comments || !updatedAppointment.date || !updatedAppointment.student || !updatedAppointment.professional) {
        return res.status(400).json({ "erro": "Todos os campos devem ser preenchidos." });
    }

    appointmentsDB[appointmentIndex] = updatedAppointment;
    fs.writeFileSync(path.join(__dirname, '../db/appointments.json'), JSON.stringify(appointmentsDB, null, 2), 'utf8');

    return res.json(updatedAppointment);
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
 *         schema:
 *           type: string
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
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const appointmentIndex = appointmentsDB.findIndex(appt => appt.id === id);

    if (appointmentIndex === -1) return res.status(404).json({ "erro": "Compromisso não encontrado" });

    const deletedAppointment = appointmentsDB.splice(appointmentIndex, 1)[0];
    fs.writeFileSync(path.join(__dirname, '../db/appointments.json'), JSON.stringify(appointmentsDB, null, 2), 'utf8');

    return res.json(deletedAppointment);
});

module.exports = router;
