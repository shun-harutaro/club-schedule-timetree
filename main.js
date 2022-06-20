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

const JSON = require('./convertJson');
const SET_PARAM = require('./setParam');
const OBJ = JSON.read();
const items = Object.keys(OBJ).length;

const postAll = async () => {
    for (var i = 0; i < items; i++) {
        const obj = OBJ[i + 1];
        if (obj.activity !== true) {
            console.log(`There aren't activity #${i+1}`);
            continue;
        }
        const params = SET_PARAM.setParam(obj);
        await timetree.post(`calendars/${TIMETREE_CALENDAR_ID}/events`, JSON.stringify(params))
        .then(res => {
            console.log(`success #${i+1}`);
        })
        .catch(err => {
            console.log(`faild #${i+1}`);
            const errData = err.response.data.errors;
            console.log({errData});
        });
    }
    console.log(`${items} items are done`);
}
postAll();