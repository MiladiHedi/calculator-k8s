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
const sub = redisClient.duplicate();

function fac(number) {
  console.log("calculate power; ");
  console.log(number);

  if (number == 0 || number == 1 ) return number;
  var result=1;
  for (let i = 0; i < number; i++) {
    result= (number-i)*result;
  }
   //persist in postgres
   pgClient.query('INSERT INTO factorials (number, result) VALUES($1, $2)', [number, result]);
  return result;
}

sub.on('message', (channel, message) => {
  console.log("receve message :");
  redisClient.hset('factorials', message, fac(parseInt(message)));
});
sub.subscribe('insertFactorialValue');
