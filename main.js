/* exert file */
'use strict'
const APP = require('./app');
const POST = require('./post')
const OBJ = APP.read();
//const CREATE = POST.createEvent();

//console.log({OBJ});
const eight = POST.createEvent(8, OBJ)

//console.log(eight);

