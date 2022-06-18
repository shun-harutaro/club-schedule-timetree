/* exert file */
'use strict'
const APP = require('./app');
const POST = require('./post');
const OBJ = APP.read();
const items = Object.keys(OBJ).length;
for (var i = 0; i < items; i++) {
    const obj = OBJ[i + 1];
    if (obj.activity !== true) {
        continue;
    }
    const res = POST.createEvent(obj);
}