const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données SQLite
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connecté à la base de données SQLite');
    }
});

// Création de la table books
db.run(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('Erreur lors de la création de la table:', err);
    } else {
        console.log('Table "books" prête ou déjà existante');
    }
});

// GET /books - Récupérer tous les livres
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST /books - Créer un nouveau livre
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    
    // Validation
    if (!title || !author) {
        return res.status(400).json({ 
            error: 'Le titre et l\'auteur sont requis' 
        });
    }
    
    db.run(
        'INSERT INTO books (title, author) VALUES (?, ?)',
        [title, author],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                title,
                author
            });
        }
    );
});

// Route racine
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de livres fonctionnelle',
        endpoints: {
            'GET /books': 'Récupérer tous les livres',
            'POST /books': 'Créer un nouveau livre'
        }
    });
});

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
    console.log(' API de gestion de livres prête');
});