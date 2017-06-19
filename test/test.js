'use strict';
var util = require('../index.js');

var i = 0;
setInterval(function(){
    i++;
    util.taskQueue.add(function(next){
        setTimeout(function(){
            console.log('run task ' + i);
            next();
        }, 2000);
    });

}, 200);
