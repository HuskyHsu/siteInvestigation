# 自由設計野外調查google表單

[WEB連結在此(https://huskyhsu.github.io/siteInvestigation/index.html)](https://huskyhsu.github.io/siteInvestigation/index.html)

## 功能說明

1. 連接google試算表
2. GIS互動式圖台
3. 資料連動服務
4. 區分調查完成與否
5. 定位可由GPS或是地圖中心做選取

## google試算表建立說明

### 固定欄位
|編號|經度|緯度|TWD97_X|TWD97_Y|調查時間|已調查|
|---|---|---|---|---|---|---|
|number|text|text|text|text|text|checkbox|

### 自訂欄位
欄位名稱文字可自訂
型態有以下三種可選取
1. number (只能允許整數)
2. text (任意)
3. checkbox (true or false)

### 如下圖所示
![範例](http://i.imgur.com/osRXEID.png)
[google表單連結在此(測試)](https://docs.google.com/spreadsheets/d/1AvxWdDXf4xmV8sW9to9HspmcgsRoRUfhYRZks6-iEdE/edit#gid=0)

### 取得變數名稱(範例)
|名稱|變數|值|
|---|---|---|
|google試算表ID|spreadsheetsID|1AvxWdDXf4xmV8sW9to9HspmcgsRoRUfhYRZks6-iEdE|
|工作表名稱|spreadsheetsName|工作表1|

## 建立自己的網址

> 替換綠字部分成自己的試算表ID與工作表名稱

<p>
    huskyhsu.github.io/siteInvestigation/index.html?<span style='color: #FF2D2D'>spreadsheetsID</span>=<span style='color:  #00BB00'>1AvxWdDXf4xmV8sW9to9HspmcgsRoRUfhYRZks6-iEdE</span>&<span style='color: #FF2D2D'>spreadsheetsName</span>=<span style='color: #00BB00'>工作表1</span>
</p>

## 實際畫面與功能
* 藍色標記為未調查
* 土色標記為已調查
* 紅色小人為GPS座標
* 藍色圈圈為GPS誤差範圍
* 中央十字為地圖中心位置
* 可修改或刪除既有資料(先點選地圖上的點，下方表格會自動更新數據)
* 新增點位可選擇GPS座標位置或地圖中心
* 點開點位後有Google導航連結可以使用
* 地圖有google地圖與衛星雲圖兩種可以選擇

![](http://i.imgur.com/bn6pMZ7.jpg)
![](http://i.imgur.com/ChitptW.jpg)


