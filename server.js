'use strict';

require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.urlencoded({extended:true}));

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Application Middleware
app.use(cors({origin: '*'}));

// API Endpoints
app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, image_url, isbn FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

// app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


app.get('/api/v1/books/:id', (req, res) => {
  client.query(`
   SELECT * FROM books WHERE book_id=$1;
  `,
    [req.params.id]
  )
    .then(results => res.send(results.rows))
    .catch(console.error);
})


app.post('/api/v1/books', (req, res) => {
  client.query(`
    INSERT INTO books (author, title, isbn, image_url, description) VALUES ('${req.body.author}', '${req.body.title}', '${req.body.isbn}', '${req.body.image_url}', '${req.body.description}');
  `).then(results => res.send(results.rows)).then(console.log('post'));
})




