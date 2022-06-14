/* This file for API */
'use strict';
/**
 * Responds to any HTTP request.
 * @param {!express:request} req HTTP request context.
 * @param {!express:response} res HTTP response context.
 */
const axiosBase = require('axios');
require('dotenv').config();
//const Promise = require('promise');

//const app = require('./app');
//const obj = app.read();

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

// POST /calendars/:calendar_id/events のときのパラメーター
// https://developers.timetreeapp.com/ja/docs/api#post-calendarscalendar_idevents
const params = {
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
                    id: `${TIMETREE_CALENDAR_ID},1`, // ラベル（未提出:#e73b3b）
                    type: "label"
                }
            }
        }
    }
};

// "hh:mm～hh:mm" のフォーマットを[ms, ms] に変換
const divideTimeMs = (stringTime) => {
    const [start, end] = stringTime.split('～');
    const [startH, startM] = start.split(':');
    const startMs = (startH * 3600 + startM * 60) * 1000; 
    const [endH, endM] = end.split(':');
    const endMs = (endH * 3600 + endM * 60) * 1000;
    return [startMs, endMs];
}

// unixtime into iso8601
const dateMake = (date, startMs, endMs) => {
    const isoStrStart = new Date(date*1000 + startMs).toISOString();
    const isoStrEnd = new Date(date*1000 + endMs).toISOString();
    return [isoStrStart, isoStrEnd];
}

const jsonSet = (index, obj) => {
    //console.log({index});
    const [startMs, endMs] = divideTimeMs(obj[index].time)
    const [start, end] = dateMake(obj[index].date ,startMs, endMs);
    let atr = params.data.attributes;
    atr.title = "部活"
    atr.start_at = start;
    atr.end_at = end;
    atr.description = "これはテストです"
    atr.location = "ホール"
}

exports.createEvent = (index, obj) => {
    //console.log({index});
    jsonSet(index, obj);
    //console.log({params});
    timetree.post(`calendars/${TIMETREE_CALENDAR_ID}/events`, JSON.stringify(params))
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        });
}
