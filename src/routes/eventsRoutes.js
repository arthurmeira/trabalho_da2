const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Definindo o esquema do evento
const eventSchema = new mongoose.Schema({
  description: { type: String, required: true },
  comments: { type: String, required: true },
  date: { type: Date, required: true },
});

// Criando o modelo de Evento
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
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
 *     description: Eventos de Diego
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna uma lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();  // Busca todos os eventos do MongoDB
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
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
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
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
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.post('/', async (req, res) => {
  const { description, comments, date } = req.body;
  if (!description || !comments || !date) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const event = new Event({ description, comments, date });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar evento', details: error.message });
  }
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
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar evento', details: error.message });
  }
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
 *         description: Evento deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json({ message: 'Evento deletado com sucesso', event });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
});

module.exports = router;
