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

// POST /calendars/:calendar_id/events のときのパラメーター
// https://developers.timetreeapp.com/ja/docs/api#post-calendarscalendar_idevents
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

const dateMake = () => {
    const dt = new Date();
    const dt_end = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
    const isoStrStart = dt.toISOString();
    const isoStrEnd = dt_end.toISOString();
    return [isoStrStart, isoStrEnd];
}

const createEvent = () => {
    const jsonSet = () => {
        const [start, end] = dateMake();
        let atr = params.data.attributes;
        atr.title = "部活"
        atr.start_at = start;
        atr.end_at = end;
        atr.description = "これはテストです"
        atr.location = "ホール"
    }
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