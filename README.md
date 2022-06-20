# club-schedule-timetree
## Usage
1. リポジトリをクローン
2. フォルダ内に使いたいエクセルファイルを入れる
3. .env ファイルを作成し、パーソナルアクセストークン・カレンダーID・エクセルファイルの名前を記述
```
touch .env
echo "token = [personal access token]"
echo "calendarid = [calendar id]"
echo "file name = [xxxx.xlsm]
```
4. 実行する
```
node main.js
```
## Structure
- convertJson.js
    - exelファイルを読み込み各日付ごとのJSONファイルに変換する
- setParam.js
    - APIに適した形式に整えたオブジェクトを返す
- main.js
    実行するファイル。上記２ファイルをライブラリとして読み込みAPIにPOSTする