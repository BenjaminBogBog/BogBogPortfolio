const express = require('express');
const mysql = require('mysql');

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

//Start-up the server
var server = app.listen(8000, () => {
    var host = server.address().address
    var port = server.address().port
    console.log("App is listening at port %s:%s", host, port);
});

