/* This file make request */
'use strict';
const TIMETREE_CALENDAR_ID = process.env.timetreeid;
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
                    id: `${TIMETREE_CALENDAR_ID},1`, // ラベル（活動予定）
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

exports.jsonSet = (obj) => {
    let atr = params.data.attributes;
    const [startMs, endMs] = divideTimeMs(obj.time)
    let start, end;
    if (isNaN(startMs + endMs)) {
        console.log("Time couldn't convert to Number");
        start = end = new Date (obj.date*1000).toISOString();
        atr.all_day = true;
    } else {
        [start, end] = dateMake(obj.date ,startMs, endMs);
        atr.all_day = false;
    }
    atr.start_at = start;
    atr.end_at = end;
    atr.title = "部活";
    atr.location = obj.location;
    atr.description = `- 担当教員：${obj.teacher}
- 活動可能場所：${obj.detail}
- 備考：${obj.remark}`;
    return params;
}