const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from factorials');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('factorials', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const indexFactorial = req.body.index;

    redisClient.hget('factorials', indexFactorial,(err, value) => {
    console.log("index : "+value);
    if (value === null || value ==='Nothing yet!'){
      console.log("index not found in redis");
    
      pgClient.query('SELECT result from factorials where number=$1', [indexFactorial]).then(function(rs){
       
        var rows = rs.rows;

        if (Array.isArray(rows) && rows.length === 0) {
          console.log("index : "+ indexFactorial +" not found in postgres, we calculate");
          redisClient.hset('factorials', indexFactorial, 'Nothing yet!');
          redisPublisher.publish('insertFactorialValue', indexFactorial);
        }else{
          var row = rows[0];
          var number =row['index']
          var result =row['result']
          console.log("we save number and result in redis cache");
          redisClient.hset('factorials', number, result);
        }

      });
           
    }else{
      console.log("index ok");
    }
  });
  
  res.send({ working: true });
});


app.listen(keys.ownPort, err => {
  console.log('Listening on port :' +keys.ownPort );
});
