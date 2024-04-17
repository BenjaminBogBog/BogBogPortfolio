const express = require('express');
const mysql = require('mysql');

const port = process.env.PORT || 8000;

//Create connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chicken_runner_database'
});

const app = express();

app.use(express.json());

//Insert new users
app.post('/addUser', (req, res) => {

    const { username, score } = req.query;

    if (!username || score === undefined) {
        return res.status(400).send('Username or score missing!');
    }

    db.query('INSERT INTO user_data (username, score) VALUES (?, ?)', [username, score], (error, results) => {
        if (error) {
            return res.status(500).send('An error occurred while inserting the user data!');
        }
        res.send(`User added with ID: ${results.insertId}`);
    });
});

//Get user data
app.get('/getUsersData', (req, res) => {

    db.query('SELECT * FROM user_data', (error, results) => {
      if (error) {
        return res.status(500).send('An error occurred while retrieving the user data!');
    };
    
      res.json(results);
    });
  });

// Root to test connection
app.get('/', (req, res) => {
    res.send('Chickity Chickity')
  })
  
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })

