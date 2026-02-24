const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// On utilise les variables d'environnement que Kubernetes nous donnera
const pool = new Pool({
  host: process.env.DB_HOST || 'db-service', // Nom du service K8s
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`<h1>Application Web Connectée !</h1>
              <p>La connexion à PostgreSQL est réussie.</p>
              <p>Heure de la DB : ${result.rows[0].now}</p>`);
  } catch (err) {
    res.status(500).send("Erreur de connexion à la base : " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Serveur prêt sur le port ${port}`);
});