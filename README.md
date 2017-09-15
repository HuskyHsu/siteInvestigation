# 自由設計野外調查作業平台

* [Web Site](https://huskyhsu.github.io/siteInvestigation/index.html)
* [Web Site(Mobile)](https://huskyhsu.github.io/siteInvestigation/index_es5.html)

> 手機版本需使用較舊的語法提升相容性，建議畫面出不來的可以採用第二個連結

![](https://raw.githubusercontent.com/HuskyHsu/siteInvestigation/master/demo/cover.png)

## 功能說明

1. 連接google試算表與google雲端硬碟
2. GIS互動式圖台
3. 資料連動服務
4. 區分調查完成與否
5. 定位可由GPS或是地圖中心做選取
6. 上傳照片至雲端硬碟
7. 線面圖資存放

## 私人資料表建立說明

### google試算表

#### 固定欄位
|編號|經度|緯度|TWD97_X|TWD97_Y|調查時間|已調查|照片名稱|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|number|text|text|text|text|text|checkbox|file|

#### 自訂欄位
欄位名稱文字可自訂
型態有以下三種可選取
1. number (只能允許整數)
2. text (任意)
3. checkbox (true or false)

#### 圖資

|名稱|Geojson|顯示欄位|線顏色|填充顏色|
|:----:|:----:|:----:|:----:|:----:|
| Text     | geojson code | Text     | #FF0000  | #FF0000  |

* google試算表中的工作表名稱需設定為【圖資】兩字
* geojson需為WGS84座標系統　(可用QGIS轉換shp檔至geojson檔，並順便轉換座標)
* 顯示欄位填要顯示的屬性名稱
* 顏色採用RGB16位元格式，且填充顏色預設透明度為0.2　([RGB色卡網站](https://www.ifreesite.com/color/))

#### 如下圖所示
![範例](https://raw.githubusercontent.com/HuskyHsu/siteInvestigation/master/demo/spreadsheets1.png)
![範例](https://raw.githubusercontent.com/HuskyHsu/siteInvestigation/master/demo/spreadsheets2.png)
![範例](https://raw.githubusercontent.com/HuskyHsu/siteInvestigation/master/demo/drive.png)

#### 範例測試
[google表單連結在此(測試)](https://docs.google.com/spreadsheets/d/1AvxWdDXf4xmV8sW9to9HspmcgsRoRUfhYRZks6-iEdE/edit#gid=0)
[google雲端硬碟(測試)](https://drive.google.com/drive/folders/0BzccTlxkvzijX3hpcW10N3BhYUE)

### 取得變數名稱(範例)
|名稱|變數|值|
|---|---|---|
|google試算表ID|spreadsheetsID|1AvxWdDXf4xmV8sW9to9HspmcgsRoRUfhYRZks6-iEdE|
|工作表名稱|spreadsheetsName|工作表1|
|google drive資料夾ID|driveFolderID|0BzccTlxkvzijX3hpcW10N3BhYUE|

## 建立自己的網址

> 替換[]部分成自己的試算表ID與工作表名稱

huskyhsu.github.io/siteInvestigation/index.html?spreadsheetsID=[google試算表ID]&spreadsheetsName=[工作表名稱]&driveFolderID=[0BzccTlxkvzijX3hpcW10N3BhYUE]


## 實際畫面與功能
* 藍色標記：未調查
* 土色標記：已調查
* 粉色標記：選取點位
* 紅色小人為GPS座標
* 藍色圈圈為GPS誤差範圍
* 中央十字為地圖畫面中心位置
* 可修改或刪除既有資料與座標(先點選地圖上的點，下方表格會自動更新數據)
* 新增點位可選擇GPS座標位置或地圖中心
* 點開點位後有Google導航連結可以使用
* 地圖有google地圖與衛星雲圖兩種可以選擇
* 可上傳照片
* 顯示線面圖資與說明

![](http://i.imgur.com/gYi17Wo.jpg)

### 未完功能
- [ ] 距離量測
- [ ] 建立線面資料
- [ ] 自訂顯示名稱(編號)
- [ ] 地圖上顯示點名稱
- [ ] 照片CRUD
- [ ] 地籍座標兩者轉換
