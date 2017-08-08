var CronJob = require('cron').CronJob;
var updatePrice = require('./update-price');
module.exports = function(){
    new CronJob('00 41 21 * * *', function() {
        // updatePrice();
        console.log('update-price-cron-started');
    }, null, true, 'UTC');
}
