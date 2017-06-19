'use strict';
var util = require('../index.js');

var i = 0,
    task = function(){
        util.taskQueue.add(function(next){
            setTimeout(function(){
                console.log('=============')
                console.log('run task ' + i);
                console.log('=============')
                next();
            }, 1000);
        });
    };
setInterval(function(){
    i++;
    task();
    task();
    task();
    task();
}, 200);
