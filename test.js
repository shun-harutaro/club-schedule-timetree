const app = require('./app');
const obj  = app.read();

//console.log(obj[1]);

'use strict';
/**
 * Responds to any HTTP request.
 * @param {!express:request} req HTTP request context.
 * @param {!express:response} res HTTP response context.
 */
const axiosBase = require('axios');
require('dotenv').config();
//const Promise = require('promise');

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

let params = {
    data: {
        attributes: {
            category: 'schedule',
            title: null,
            all_day: false,
            start_at: null,
            start_timezone: 'Asia/Tokyo',
            end_at: null,
            end_timezone: 'Asia/Tokyo',
            description: '',
            location: '',
        },
        relationships: {
            label: {
                data: {
                    id: `${TIMETREE_CALENDAR_ID},6`, // ラベル（未提出:#e73b3b）
                    type: "label"
                }
            }
        }
    }
};

const divideTimeMs = (stringTime) => {
    const [start, end] = stringTime.split('～');
    const [startH, startM] = start.split(':');
    const startMs = (startH * 3600 + startM * 60) * 1000; 
    const [endH, endM] = end.split(':');
    const endMs = (endH * 3600 + endM * 60) * 1000;
    return [startMs, endMs];
}

const dateMake = (date, startMs, endMs) => {
    const isoStrStart = (date*1000 + startMs).toISOString();
    const isoStrEnd = (date*1000 + endMs).toISOString();
    return [isoStrStart, isoStrEnd];
}

console.log(divideTimeMs(obj[7].start_at));

const jsonSet = () => {
    const [startMs, endMs] = divideTimeMs(obj[7].time)
    const [start, end] = dateMake(startMs, endMs);
    let atr = params.data.attributes;
    atr.title = "部活"
    atr.start_at = start;
    atr.end_at = end;
    atr.description = "これはテストです"
    atr.location = "ホール"
}

const createEvent = () => {
    jsonSet();
    console.log(params);
    timetree.post(`calendars/${TIMETREE_CALENDAR_ID}/events`, JSON.stringify(params))
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        });
}

createEvent()