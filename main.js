/* exert file */
'use strict'
/**
 * Responds to any HTTP request.
 * @param {!express:request} req HTTP request context.
 * @param {!express:response} res HTTP response context.
 */
 const axiosBase = require('axios');
 require('dotenv').config();
 
 // 環境変数(.env.yaml)
 const TIMETREE_PERSONAL_TOKEN = process.env.timetreetoken; // パーソナルアクセストークン
 const TIMETREE_CALENDAR_ID = process.env.timetreeid; // calendarid
 
 const timetree = axiosBase.create({
     baseURL: 'https://timetreeapis.com/', // クライアント
     headers: {
       'Content-Type': 'application/json', // データ形式
       'Accept': 'application/vnd.timetree.v1+json', //APIバージョン
       'Authorization': `Bearer ${TIMETREE_PERSONAL_TOKEN}` // パーソナルアクセストークンによる認証
     },
     responseType: 'json'
 });

const APP = require('./app');
const POST = require('./post');
const OBJ = APP.read();
const items = Object.keys(OBJ).length;

const postAll = async () => {
    for (var i = 0; i < items; i++) {
        console.log(`schedule of ${i+1}`);
        const obj = OBJ[i + 1];
        if (obj.activity !== true) {
            console.log(`There aren't activity`);
            continue;
        }
        const params = POST.jsonSet(obj);
        await timetree.post(`calendars/${TIMETREE_CALENDAR_ID}/events`, JSON.stringify(params))
        .then(res => {
            console.log("success");
        })
        .catch(err => {
            console.log("faild");
            const code = err.response.data.errors;
            console.log({code});
        });
    }
    console.log(`${items} items are done`);
}
postAll();

/*
const obj = OBJ[20];
const params = POST.jsonSet(obj);
timetree.post(`calendars/${TIMETREE_CALENDAR_ID}/events`, JSON.stringify(params));
*/