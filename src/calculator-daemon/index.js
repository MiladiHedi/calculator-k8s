const keys = require('./keys');
const axios = require('axios');

var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '*/5 * * * * *',
  onTick: function() {
    console.log( 'loop');
    var factorialOrPower= getRandomInt(2);
    console.log( 'factorialOrPower, random flag : '+ factorialOrPower);
    if (factorialOrPower) {
      //factorial
      
      var index= getRandomInt(20);
      console.log( 'factorial request, index : '+index);
      console.log( 'post to  http://'+keys.factorialApiHost+':'+keys.factorialApiPort+'/values');
      //axios.post('http://factorial-api:5001/values', {
      axios.post('http://'+keys.factorialApiHost+':'+keys.factorialApiPort+'/values', {
        index: index
      });
    
      
    } else {
      //power
      var number= getRandomInt(10);
      var power= getRandomInt(10);
      console.log( 'power request, number :'+number+', power :'+power);
      console.log( 'post to  http://'+keys.powerApiHost+':'+keys.powerApiPort+'/values');
      axios.post('http://'+keys.powerApiHost+':'+keys.powerApiPort+'/values', {
      //axios.post('http://power-api:5000/values', {
        index: number,
        power: power
      });
      

    };
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}




