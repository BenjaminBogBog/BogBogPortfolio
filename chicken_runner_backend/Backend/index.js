const express = require('express');
const pg  = require('pg');
const serveStatic = require('serve-static');

const { Client } = pg

// Initialization.... Creating Connection to DB in externally in the cloud
const connectionString = "postgres://chicken_runner_postgre_user:L9fzfF2PxCD6A1TOt1VrXc3ehxkO2Ucm@dpg-cofp1juv3ddc739n4ti0-a.singapore-postgres.render.com/chicken_runner_postgre?ssl=true";
const client = new Client({
	connectionString
});

const port = process.env.PORT || 8000;

client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});

const app = express();

app.use(express.json());
app.use(serveStatic('Game', {
  setHeaders: (res, path) => {
    if (path.endsWith('.wasm.gz')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
 
    if (path.endsWith('.gz')) {
      res.setHeader('Content-Encoding', 'gzip');
    }
  }
}));

//Insert new users
app.post('/addUser', (req, res) => {

    const { username, score } = req.query;

    console.log(req.query);

    if (!username || score === undefined) {
        return res.status(400).send('Username or score missing!');
    }

    let insertQuery = `INSERT INTO user_data (username, score) VALUES ('${username}', ${score})`
    console.log(insertQuery)

    client.query(insertQuery, (error, results) => {

        if (error) {
            return res.status(500).send('An error occurred while inserting the user data! : %s' + error);
        }
        res.send(results);
    });
});

//Get user data
app.get('/getUsersData', (req, res) => {

  client.query('SELECT * FROM user_data', (error, results) => {
      if (error) {
        return res.status(500).send('An error occurred while retrieving the user data!');
    };
    
      res.json(results);
    });
  });

  app.get('/getUsersData', (req, res) => {

    client.query('SELECT * FROM user_data', (error, results) => {
        if (error) {
          return res.status(500).send('An error occurred while retrieving the user data!');
      };
      
        res.json(results);
      });
    });

// Root to test connection
app.get('/', (req, res) => {
  console.log("Chikity Chickity")
  })
  
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })

