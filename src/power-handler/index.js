const keys = require('./keys');
const redis = require('redis');
const { Pool } = require('pg');

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const suscriber = redisClient.duplicate();

function power(number, power) {
  console.log("calculate power");
  if (number == 0 || number == 1 ) return number;
  var result=1;
  if (power == 0 ) return 1;
  var result=number;
  for (let i = 0; i < power-1; i++) {
    result= number*result;   
  }

  return result;
}

function power(message) {
  console.log("calculate power; ");
  console.log(message);

  var array = message.split("^",2); 
  var number =  parseInt(array[0]);
  var power =  parseInt(array[1]);

  if (number == 0 || number == 1 ) return number;
  var result=1;
  if (power == 0 ) return 1;
  var result=number;
  for (let i = 0; i < power-1; i++) {
    result= number*result;   
  }

  //persist in postgres
  pgClient.query('INSERT INTO powers (number, power, result) VALUES($1,$2, $3)', [number, power, result]);

  return result;
}

suscriber.on('message', (channel, message) => {
  console.log("receve message :");
  redisClient.hset('powers', message, power(message));
});
suscriber.subscribe('insertPowerValue');
