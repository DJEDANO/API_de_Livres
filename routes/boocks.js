const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /books - Récupérer tous les livres
router.get('/', (req, res) => {
    Book.getAll((err, books) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(books);
    });
});

// POST /books - Créer un nouveau livre
router.post('/', (req, res) => {
    const { title, author } = req.body;

    // Validation des données
    if (!title || !author) {
        return res.status(400).json({ 
            error: 'Le titre et l\'auteur sont requis' 
        });
    }

    Book.create({ title, author }, (err, newBook) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(newBook);
    });
});

module.exports = router;