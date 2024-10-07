const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let eventsDB = require('../db/events.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - description
 *         - comments
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: O ID único do evento
 *         description:
 *           type: string
 *           description: Descrição do evento
 *         comments:
 *           type: string
 *           description: Comentários sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *       example:
 *         id: "31b36255-35c9-4c27-96a0-5756bdc629f4"
 *         description: "Palestra Setembro Amarelo"
 *         comments: "Profissionais de saúde mental da Unesc"
 *         date: "2024-09-16T16:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Diego
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna uma lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', (req, res) => {
    res.json(eventsDB);
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Retorna os dados do evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const event = eventsDB.find(event => event.id === id);
    if (!event) return res.status(404).json({ "erro": "Evento não encontrado" });
    res.json(event);
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: O evento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Campos obrigatórios faltando
 */
router.post('/', (req, res) => {
    const event = { id: uuidv4(), ...req.body };

    if (!event.description) return res.status(400).json({ "erro": "A descrição do evento é obrigatória" });
    if (!event.comments) return res.status(400).json({ "erro": "Os comentários do evento são obrigatórios" });
    if (!event.date) return res.status(400).json({ "erro": "A data do evento é obrigatória" });

    eventsDB.push(event);
    fs.writeFileSync(path.join(__dirname, '../db/events.json'), JSON.stringify(eventsDB, null, 2), 'utf8');

    return res.status(201).json(event); 
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza os dados de um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: O evento foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const atualEventIndex = eventsDB.findIndex(event => event.id === id);

    if (atualEventIndex === -1) {
        return res.status(404).json({ "erro": "Evento não encontrado" });
    }

    const newEvent = { ...req.body, id: eventsDB[atualEventIndex].id };

    if (!newEvent.description || !newEvent.comments || !newEvent.date) {
        return res.status(400).json({ "erro": "Todos os campos devem ser preenchidos." });
    }

    eventsDB[atualEventIndex] = newEvent;
    fs.writeFileSync(path.join(__dirname, '../db/events.json'), JSON.stringify(eventsDB, null, 2), 'utf8');

    return res.json(newEvent);
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deleta o evento através do ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: O evento foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const atualEventIndex = eventsDB.findIndex(event => event.id === id);

    if (atualEventIndex === -1) return res.status(404).json({ "erro": "Evento não encontrado" });

    const deletado = eventsDB.splice(atualEventIndex, 1)[0];
    fs.writeFileSync(path.join(__dirname, '../db/events.json'), JSON.stringify(eventsDB, null, 2), 'utf8');

    return res.json(deletado);
});

module.exports = router;
