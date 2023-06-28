# club-schedule-timetree
## Usage
1. パーソナルアクセストークンの入手
    - https://timetreeapp.com/developers/personal_access_tokens より
2. カレンダーID の確認
    - 使用したいカレンダーを選択しURL(`https://timetreeapp.com/calendars/xxxxxxxx`)の xxxxxx の部分がID
3. リポジトリをクローン
4. フォルダ内に使いたいエクセルファイルを入れる
5. .env ファイルを作成し、パーソナルアクセストークン・カレンダーID・エクセルファイルの名前を記述
```
touch .env
echo "token = [personal access token]" >> .env
echo "calendarid = [calendar id]" >> .env
echo "filename = [xxxx.xlsm] >> .env
```
6. 実行する
```
yarn install
node main.js
```
## Structure
- convertJson.js
    - exelファイルを読み込み各日付ごとのJSONファイルに変換する
- setParam.js
    - APIに適した形式に整えたオブジェクトを返す
- main.js
    - 実行するファイル。上記２ファイルをライブラリとして読み込みAPIにPOSTする
## Reference
https://developers.timetreeapp.com/ja/docs/api/oauth-app
