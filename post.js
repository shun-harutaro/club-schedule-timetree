/* This file for API */
'use strict';
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
    const timeDiffJST = 9 * 60 * 60 * 1000; // JST to UTC
    const isoStrStart = new Date(date*1000 + startMs - timeDiffJST).toISOString();
    const isoStrEnd = new Date(date*1000 + endMs - timeDiffJST).toISOString();
    return [isoStrStart, isoStrEnd];
}

const jsonSet = (obj) => {
    let atr = params.data.attributes;
    const [startMs, endMs] = divideTimeMs(obj.time)
    if (isNaN(startMs + endMs)) {
        console.log("Time couldn't convert to Number");
        atr.all_day = true;
        return 0;
    } else {
        const [start, end] = dateMake(obj.date ,startMs, endMs);
        atr.start_at = start;
        atr.end_at = end;
    }
    atr.title = "部活";
    atr.location = obj.location;
    atr.description = `- 担当教員：${obj.teacher}
- 活動可能場所：${obj.detail}
- 備考：${obj.remark}`;
}

exports.createEvent = (obj) => {
    jsonSet(obj);
    timetree.post(`calendars/${TIMETREE_CALENDAR_ID}/events`, JSON.stringify(params))
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        });
    return 0;
}
