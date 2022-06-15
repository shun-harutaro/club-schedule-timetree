/* exert file */
'use strict'
const APP = require('./app');
const POST = require('./post');
const OBJ = APP.read();
//const CREATE = POST.createEvent();

const items = Object.keys(OBJ).length;
for (var i = 0; i < items; i++) {
    POST.createEvent(i + 1, OBJ);
}
