const XLSX = require("xlsx");
const book = XLSX.readFile('test.xlsm');

const sheet = book.Sheets[book.SheetNames[0]];


//const date_exel_serial = sheet['A7'].v
const exelToUnixTime = (exel_time) => {
    // convert into unixtime
    return (exel_time - 25569) * 86400;
}
//const date_unix_time = exelToUnixTime(date_exel_serial)
/*
const year = sheet['K2'].v
const month = sheet['L2'].v;
const date = sheet['A7'].v;
console.log(year, month)
*/

const TorF = (char) => {
    if (char == '○') {
        return true
    } else if (char == '✖') {
        return false
    } else {
        return false
    }
}

const generateObj = (arr) => {
    /*
    let dataMap = new Map([
        ['date', null],
        ['day', ''],
        ['available', false],
        ['activity', false],
        ['start_at', ''],
        ['teacher', ''],
        ['location', ''],
        ['detail', ''],
        ['remark', '']
    ])
    let count = 0;
    for (let key of dataMap.keys()) {
        dataMap.set(key, arr[count]);
        count++;
    }
    return dataMap
    */
   let dataObj = {
        date : null,
        day : '',
        available : false,
        activity : false,
        start_at : '',
        teacher : '',
        location : '',
        detail : '',
        remark : ''
   }
   let count = 0;
   Object.keys(dataObj).forEach((key) => {
       dataObj[key] = arr[count];
       count++;
   })
   return dataObj;
}

const rowSerch = (R) => {
    let data_row = Array(9);
    for (var C = 0; C <= 8; ++C) {
        var cell_address = {c:C, r:R};
        var cell_ref = XLSX.utils.encode_cell(cell_address);
        switch(C) {
            case 0:
                const date = sheet[cell_ref].v;
                if (date === '') {
                    flag = true;
                    console.log("error");
                    break;
                }
                data_row[C] = exelToUnixTime(date);
                break;
            case 2:
            case 3:
                data_row[C] = TorF(sheet[cell_ref].v)
                break;
            default:
                try {
                    data_row[C] = sheet[cell_ref].v;
                } catch {
                    data_row[C] = "";
                }
                break;
        }
        if (data_row[2] == false || data_row[3] == false) {
            break;
        }
        if (flag) {
            console.log("dates are overed");
            break;
        }
    }
    return data_row
}

let flag = false;
const result = {};
for (var R = 6; R <= 6+31-1; ++R) {
    const data_row = rowSerch(R);
    if (flag) {
        break;
    }
    const params = generateObj(data_row);
    result[(R-5).toString()] = params;
}
console.log(result);