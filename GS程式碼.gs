function doGet(e) {
   
  var para = e.parameter; // 存放 get 所有傳送的參數
  var url = 'https://docs.google.com/spreadsheets/d/' + para.spreadsheetsID + '/edit#gid=0';
  var name = para.spreadsheetsName;
   
  var SpreadSheet = SpreadsheetApp.openByUrl(url);
  var sheet1 = SpreadSheet.getSheetByName(name);
    
  var method = para.method;

  if (method == "getFieldNames") {
    return getFieldNames(sheet1)
  }
  else if(method == "getExistingData"){
    return getExistingData(sheet1)
  }
  else if(method == "getMapData"){
    return getMapData(SpreadSheet)
  }
  else {
    return ContentService.createTextOutput(JSON.stringify(para)).setMimeType(ContentService.MimeType.JSON)
//    return ContentService.createTextOutput("請輸入參數");
  }
  
}

function doPost(e) {

  var para = e.parameter; // 存放 post 所有傳送的參數
  var url = 'https://docs.google.com/spreadsheets/d/' + para.spreadsheetsID + '/edit#gid=0';
  var name = para.spreadsheetsName;
   
  var SpreadSheet = SpreadsheetApp.openByUrl(url);
  var sheet1 = SpreadSheet.getSheetByName(name);
  
  var method = para.method;
  
  if (method == "PostEdit") {
    return PostEdit(sheet1, para);
  }
  else if(method == 'PostAdd') {
    return PostAdd(sheet1, para);
  }
  else if(method == 'PostDelete'){
    return PostDelete(sheet1, para);
  }
  else {
    return ContentService.createTextOutput(JSON.stringify(para)).setMimeType(ContentService.MimeType.JSON)
  }

}

//取得欄位名稱列與型態
function getFieldNames(sheet1) {

  var columnLength = sheet1.getLastColumn();
  var fieldNames = sheet1.getRange(1, 1, 1, columnLength).getValues()[0];
  var fieldTypes = sheet1.getRange(2, 1, 1, columnLength).getValues()[0];
  
  var returnData = [];
  
  fieldNames.forEach(function(value, index){
    returnData[index] = {
      fieldName: value,
      fieldType: fieldTypes[index]
    }
  })
  
  return ContentService.createTextOutput(JSON.stringify(returnData)).setMimeType(ContentService.MimeType.JSON)
}

//取得資料
function getExistingData(sheet1) {

  var rowLength = sheet1.getLastRow() - 2; // 列數
  if (rowLength == 0) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON)
  }
  var columnLength = sheet1.getLastColumn(); // 欄數
  var allData = sheet1.getRange(3, 1, rowLength, columnLength).getValues();
  var fieldNames = sheet1.getRange(1, 1, 1, columnLength).getValues()[0];
  
  var returnData = allData.map(function(value, index){
    var rowData = {}
    value.forEach(function(d, i) {
      rowData[fieldNames[i]] = value[i]
    })
    
    return rowData
  })
  
  return ContentService.createTextOutput(JSON.stringify(returnData)).setMimeType(ContentService.MimeType.JSON)
  
}

//取得圖資資料
function getMapData(SpreadSheet) {
  
  var sheet1 = SpreadSheet.getSheetByName('圖資');

  var rowLength = sheet1.getLastRow() - 1; // 列數
  if (rowLength == 0) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON)
  }
  var columnLength = sheet1.getLastColumn(); // 欄數
  var allData = sheet1.getRange(2, 1, rowLength, columnLength).getValues();
//  var fieldNames = sheet1.getRange(1, 1, 1, columnLength).getValues()[0];
  
  var returnData = allData.map(function(value, index){
    return {
      name: value[0],
      geojson: JSON.parse(value[1]).features,
      showName: value[2],
      style: {color:value[3], fillColor:value[4]}
    }
  })
  
  return ContentService.createTextOutput(JSON.stringify(returnData)).setMimeType(ContentService.MimeType.JSON)
}

//修改原有資料
function PostEdit(sheet1, para) {
  
  var columnLength = sheet1.getLastColumn();
  var rowLength = sheet1.getLastRow() - 2; // 列數
  var fieldNames = sheet1.getRange(1, 1, 1, columnLength).getValues()[0];
  var allID = sheet1.getRange(3, 1, rowLength, 1).getValues();
  
  //檔案轉換
  var file = para['照片名稱'].split("&")
  if (file.length > 1) {
    var driveFolderID = file[0].replace('driveFolderID=', '')
    var fileName = file[1].replace('fileName=', '')
    var fileBase64Code = file[2].replace('fileBase64Code=', '')
    para['照片名稱'] = fileName;
    
    //上傳檔案
    var data = Utilities.base64Decode(fileBase64Code, Utilities.Charset.UTF_8);
    var blob = Utilities.newBlob(data, MimeType.JPEG, fileName);
    var thisFolder = DriveApp.getFolderById(driveFolderID);
    thisFolder.createFile(blob);
  } else {
    para['照片名稱'] = "";
  }
  

  
  //時間修正
  var m = new Date(para['調查時間']);
  para['調查時間'] = m.getFullYear() +"/"+ (m.getMonth()+1) +"/"+ m.getDate() + " " + m.getHours() + ":" + m.getMinutes() + ":" + m.getSeconds();
  
  var values = [
    fieldNames.map(function(value, index){
      return para[value]
    })
  ]
     
  var ID = values[0][0]
  
  var which = 0
  for(var i = 0; i < rowLength; i++){
    if (allID[i][0].toString() == ID){
      which = i + 3
      break
    }
  }
  
  var getOldFileName = sheet1.getRange(which, 8).getValue();
  values[0][7] = getOldFileName + (values[0][7] == "" ? "" : ';' + values[0][7]);
      
  var range = sheet1.getRange(which, 1, 1, columnLength);  
  range.setValues(values);
    
  return ContentService.createTextOutput("成功更新");
}

//新增資料
function PostAdd(sheet1, para) {
  
  var columnLength = sheet1.getLastColumn();
  var rowLength = sheet1.getLastRow() - 2; // 列數
  var fieldNames = sheet1.getRange(1, 1, 1, columnLength).getValues()[0];
  var rowNum = sheet1.getRange(rowLength + 2, 1).getValue()
  
  para['編號'] = isNaN(parseInt(rowNum)) ? 1 : (parseInt(rowNum) + 1);
    
  var values = fieldNames.map(function(value, index){
      return para[value]
  })
  
  var m = new Date(values[5]);
  values[5] = m.getFullYear() +"/"+ (m.getMonth()+1) +"/"+ m.getDate() + " " + m.getHours() + ":" + m.getMinutes() + ":" + m.getSeconds();

  sheet1.appendRow(values);
    
  return ContentService.createTextOutput("新增更新");
}

//刪除資料
function PostDelete(sheet1, para) {
  
  var columnLength = sheet1.getLastColumn();
  var rowLength = sheet1.getLastRow() - 2; // 列數
  var allID = sheet1.getRange(3, 1, rowLength, 1).getValues();
  var DeleteID = para.DeleteID
      
  var which = 0
  for(var i = 0; i < rowLength; i++){
    if (allID[i][0].toString() == DeleteID){
      which = i + 3
      break
    }
  }
  
  sheet1.deleteRow(which);
    
  return ContentService.createTextOutput("成功刪除");
}