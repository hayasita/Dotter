/**
 * @file jsdata.cpp
 * @author hayasita04@gmail.com
 * @brief jsonデータ処理
 * @version 0.1
 * @date 2024-03-17
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#include <esp_task_wdt.h>
#include <string>
#include <cstring>
#include <FS.h>
#include "SPIFFS.h"
#include "dotserver.h"
#include "jsdata.h"
#include "timeCtrl.h"

jsonData::jsonData(void)
{
  _row = 8;
  _col = 16;
  dataType = DataType::Undefined;   // データフォーマット

  // setting.json 設定パラメータ
  glowInTheBright = 4;              // 表示輝度
  rotatePosition = 0;               // 表示方向
  dotColor = 1;                     // WebIFマトリクスエディタ表示色設定
  showSampleData = 1;               // サンプルデータ表示
  dataNumber = 0;                   // 表示データ番号
  staStartupConnect = 1;            // STA起動時接続設定
  staReConnectInterval = 4;         // STA再接続間隔
  soundEnable = 1;                  // サウンド有効設定
  clockScrollTime = 100;            // 時計スクロール時間

  animationTime = 500;              // アニメーション間隔

  pageCount =0;                     // ページ位置

  jsonMutex = portMUX_INITIALIZER_UNLOCKED; // Mutex

  modeWriteSq = ModeWriteSQ::WAIT;          // 動作モード書き込み要求状態 初期化

  return;
}

/**
 * @brief WiFi接続設定ポインタ設定
 * 
 * @param pWifiCon WiFi接続設定ポインタ
 */
void jsonData::wifiPSet(WiFiConnect* pWifiCon)
{
  pWifiConnect_ = pWifiCon;
  return;
}

/**
 * @brief モード設定書き込み要求
 * 
 */
void jsonData::modeWriteReq(void)
{
  modeWriteTime = millis();
  modeWriteSq = ModeWriteSQ::TIMER;
  return;
}

/**
 * @brief モード設定書き込み
 * 
 */
void jsonData::modeWrite(void)
{
  if(modeWriteSq == ModeWriteSQ::TIMER){
    if((millis() - modeWriteTime) > (1000 * 60)){ // 1分経過
    Serial.println("modeWrite");
    writeJsonFile();
    modeWriteSq = ModeWriteSQ::WAIT;
    }
  }

  return;
}

/**
 * @brief JSONデータのパース
 * 
 * @param readStr パースデータ
 * @param dataWrite 設定値書き込み有無
 * @param online    オンライン接続かどうか
 * @return true 
 * @return false 
 */
bool jsonData::parseJson(String readStr ,bool dataWrite ,bool online)
{
  DynamicJsonDocument jsonDocument(6144);

  // 受信したJSONデータをパースする
  DeserializationError error = deserializeJson(jsonDocument, readStr);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return false;
  }
  else{
    Serial.println("-- parseJson --");
    JsonDocument jsonDoc;

//    JsonArray data = jsonDocument["dataArray"];
//    Serial.println(data);

    JsonVariant jsondata;
    jsondata = jsonDocument["type"];
    if(!jsondata.isNull()){
      ledAllData.clear();   // LEDアニメーションデータ初期化
      pageCount =0;         // ページ位置初期化
      const char* dat = jsondata.as<const char*>();
      DataType dataTmp;
      if(strcmp(dat,"rgbData")==0){
        dataTmp = DataType::rgbData;
      }
      else if(strcmp(dat,"monoData")==0){
        dataTmp = DataType::monoData;
      }
      else{
        dataTmp = DataType::Undefined;
      }
      portENTER_CRITICAL(&jsonMutex);
      dataType = dataTmp;
      portEXIT_CRITICAL(&jsonMutex);
      Serial.println((char*)dat);
      Serial.printf("dataType : %d\n",dataType);
    }

    jsondata = jsonDocument["websocket"];
    if (!jsondata.isNull()) {
      const char* s = jsondata.as<const char*>();
      Serial.print("websocket : ");
      Serial.println(s);
    }

    jsonDataArray = jsonDocument["dataArray"];
    if(!jsonDataArray.isNull()){
      Serial.print("dataArray.size : ");
      Serial.println(jsonDataArray.size());

//      portENTER_CRITICAL(&jsonMutex);
//      ledAllData.clear();
      for(int i=0;i<jsonDataArray.size();i++){
        std::vector<uint8_t> PageData;
        Serial.print("datapage.size : ");
        Serial.println(jsonDataArray[i].size());
        if(dataType == DataType::rgbData){
          for(int j=0; j<jsonDataArray[i].size(); j++){
            uint8_t cdat = jsonDataArray[i][j]["c"];
            PageData.push_back(cdat);
          }
        }
        else if(dataType == DataType::monoData){
          for(int j=0; j<jsonDataArray[i].size(); j++){
            uint8_t cdat = jsonDataArray[i][j];
            PageData.push_back(cdat);
          }
        }
        portENTER_CRITICAL(&jsonMutex);
        ledAllData.push_back(PageData);     // 表示データ追加
        portEXIT_CRITICAL(&jsonMutex);
//        Serial.println(PageData[0]);
//        Serial.println(ledAllData[i][0]);
      }
//      portEXIT_CRITICAL(&jsonMutex);

    }

    jsondata = jsonDocument["time"];
    if(!jsondata.isNull()){
      const uint16_t time = jsondata.as<const uint16_t>();
      animationTime = time;
      Serial.print("time : ");
      Serial.println(animationTime);
    }

    jsondata = jsonDocument["command"];
    if(!jsondata.isNull()){
      const char* s = jsondata.as<const char*>();
      std::string str(s);  // const char* を std::string に変換
      Serial.print("command : ");
      Serial.println(str.c_str());
      if (str == "datasave") {
        Serial.println("The string is 'datasave'.");
        saveJsonFile(filename.c_str());
        filepathAdd(filename);
      }
    }

    jsondata = jsonDocument["filename"];
    if(!jsondata.isNull()){
      const char* s = jsondata.as<const char*>();
      std::string str(s);  // const char* を std::string に変換
      filename = "/data/" + str;
      Serial.print("filename : ");
      Serial.println(filename.c_str());
    }

    // 表示輝度設定読み込み
    jsondata = jsonDocument["glowInTheBright"];
    if(!jsondata.isNull()){
      const uint8_t tmp = jsondata.as<const uint8_t>();
      glowInTheBright = tmp;
//      std::string str = "{\"glowInTheBright\":" + std::to_string(tmp) + "}";
//      Serial.println(str.c_str());
    }
    // 表示輝度設定確定
    jsondata = jsonDocument["glowInTheBrightSet"];
    if(!jsondata.isNull()){
      if(dataWrite){writeJsonFile();}    // 設定値書き込み
//      const uint8_t tmp = jsondata.as<const uint8_t>();
//      std::string str = "{\"glowInTheBrightSet\":" + std::to_string(tmp) + "}";
//      Serial.println(str.c_str());
    }

    // 表示方向設定
    jsondata = jsonDocument["rotatePosition"];
    if(!jsondata.isNull()){
      const uint8_t tmp = jsondata.as<const uint8_t>();
      rotatePosition = tmp;
      if(dataWrite){writeJsonFile();}    // 設定値書き込み
//      std::string str = "{\"rotatePosition\":" + std::to_string(tmp) + "}";
//      Serial.println(str.c_str());
    }

    // ドット色設定
    jsondata = jsonDocument["dotColor"];
    if(!jsondata.isNull()){
      Serial.println("dotColor");
      const uint8_t colorValue = jsondata.as<const uint8_t>();
      dotColor = colorValue;
      if(dataWrite){writeJsonFile();}    // 設定値書き込み
      Serial.print("Color Value: ");
      Serial.println(colorValue); // 取得した値をシリアルモニターに出力
    }

    // サンプルデータ表示設定
    jsondata = jsonDocument["showSampleData"];
    if(!jsondata.isNull()){
      Serial.println("showSampleData");
      bool showSampleDataValue = jsondata.as<const uint8_t>(); // キーの値を bool 型で取得
      showSampleData = showSampleDataValue;
      if(dataWrite){writeJsonFile();}    // 設定値書き込み
      filepathIni();    // データリスト更新
      Serial.print("showSampleData Value: ");
      Serial.println(showSampleDataValue); // 取得した値をシリアルモニターに出力
    }

    // 表示データ番号設定
    jsondata = jsonDocument["dataNumber"];
    if(!jsondata.isNull()){
      Serial.println("dataNumber");
      uint8_t dataNumberValue = jsondata.as<uint8_t>(); // キーの値を uint8_t 型で取得
      dataNumber = dataNumberValue;
      if(dataWrite){writeJsonFile();}    // 設定値書き込み
      Serial.print("dataNumber Value: ");
      Serial.println(dataNumberValue); // 取得した値をシリアルモニターに出力
    }

    // WiFiアクセスポイントのリストを取得
    jsondata = jsonDocument["getWifiStaList"];
    if (!jsondata.isNull()) {
      if(jsondata.as<int>() == 1){
        Serial.println("getWifiStaList1");
        getwifiStaListreq = 1;      // 取得要求セット
      }
    }

  // stamodeSSID
//    Serial.println("-- stamodeSSID");
    jsondata = jsonDocument["ssid"];
    if(!jsondata.isNull()){
      const char* dat = jsondata.as<const char*>();
      ssid = dat;
//      confDat->setSsid((char*)dat);
//      Serial.println(confDat->getTimeZoneData());
      Serial.print("ssid : ");
      Serial.println(ssid.c_str());
//      dateUpdate = 1;
    }
    // SSID Password取得
    jsondata = jsonDocument["ssidPassword"];
    if (!jsondata.isNull()) {
      const char* dat = jsondata.as<const char*>();
      ssidpass = dat;
//      confDat->setSsidPass((char*)dat);
//      dateUpdate = 1;
      Serial.print("ssidPassword : ");
      Serial.println(ssidpass.c_str());

      // STA再接続要求セット
      wifiStaReconnect = 1;
    }

    // STA起動時接続設定
    jsondata = jsonDocument["staStartupConnect"];
    if(!jsondata.isNull()){
      Serial.println("staStartupConnect");
      uint8_t staStartupConnectValue = jsondata.as<uint8_t>(); // キーの値を uint8_t 型で取得
      staStartupConnect = staStartupConnectValue;
      if(dataWrite){writeJsonFile();}    // 設定値書き込み
      Serial.print("staStartupConnect Value: ");
      Serial.println(staStartupConnectValue); // 取得した値をシリアルモニターに出力
      pWifiConnect_->setStaReconnectEnabled(staStartupConnectValue);    // 再接続要求を受け付けるかを設定する
      if((staStartupConnectValue == 1) && (online == true) ){           // STA起動時接続設定が有効かつオンライン接続の場合実行
        sntpInit();                       // SNTP初期化
      }
    }

    // STA再接続間隔
    jsondata = jsonDocument["staReConnectInterval"];
    if(!jsondata.isNull()){
      Serial.println("staReConnectInterval");
      uint8_t staReConnectIntervalValue = jsondata.as<uint8_t>(); // キーの値を uint8_t 型で取得
      staReConnectInterval = staReConnectIntervalValue;
      if(dataWrite){writeJsonFile();}    // 設定値書き込み
      Serial.print("staReConnectInterval Value: ");
      Serial.println(staReConnectIntervalValue); // 取得した値をシリアルモニターに出力

      pWifiConnect_->setReConnectInterval(staReConnectIntervalValue);    // 再接続間隔を設定する
    }

    // サウンド有効設定
    jsondata = jsonDocument["soundEnable"];
    if(!jsondata.isNull()){
      Serial.println("soundEnable");
      uint8_t soundEnableValue = jsondata.as<uint8_t>(); // キーの値を uint8_t 型で取得
      soundEnable = soundEnableValue;
      if(dataWrite){writeJsonFile();}       // 設定値書き込み
      Serial.print("soundEnable Value: ");
      Serial.println(soundEnableValue);     // 取得した値をシリアルモニターに出力
    }

    // 時計スクロール時間
    jsondata = jsonDocument["clockScrollTime"];
    if(!jsondata.isNull()){
      Serial.println("clockScrollTime");
      uint16_t clockScrollTimeValue = jsondata.as<uint16_t>(); // キーの値を uint16_t 型で取得
      clockScrollTime = clockScrollTimeValue;
      if(dataWrite){writeJsonFile();}       // 設定値書き込み
      Serial.print("clockScrollTime Value: ");
      Serial.println(clockScrollTimeValue); // 取得した値をシリアルモニターに出力
    }
    // 時計スクロール時間スライダー更新
    jsondata = jsonDocument["clockScrollTimeSet"];
    if(!jsondata.isNull()){
      Serial.println("clockScrollTimeSet");
      uint16_t clockScrollTimeValue = jsondata.as<uint16_t>(); // キーの値を uint16_t 型で取得
      clockScrollTime = clockScrollTimeValue;
      Serial.print("clockScrollTime Value: ");
      Serial.println(clockScrollTimeValue); // 取得した値をシリアルモニターに出力
    }
    // 時計スクロール時間確定
    jsondata = jsonDocument["clockScrollTimeChangeSet"];
    if(!jsondata.isNull()){
      if(dataWrite){writeJsonFile();}       // 設定値書き込み
      Serial.println("clockScrollTimeChangeSet");
    }

    return true;
  }


}

void jsonData::saveJsonFile(const char *path)
{
  Serial.println("-- saveJsonFile");
  std::vector<uint8_t> pageData;

  File fw = SPIFFS.open(path, "w");// ⑥ファイルを書き込みモードで開く
  if(!fw){
    Serial.println("Failed to open file for writing");
    return;
  }
  String writeStr = "{\"type\":\"rgbData\",\"maxRow\":8,\"maxCol\":16,\"time\":";
  writeStr += String(jsData.animationTime);
  writeStr += "},";
  fw.println( writeStr );	// ファイルに書き込み

  for(uint8_t i = 0; i < size(); i++){
    writeStr = "{\"dataArray\":[[";
    String writeTmp;
//    pageData = getPageData(i);
    pageData = getPageSaveData(i);
    Serial.print("size():");
    Serial.println(pageData.size());
    for(uint8_t j = 0; j < pageData.size(); j++){
      if(j != 0){
        writeStr += ",";
      }
      if(pageData[j] == 0){
        writeTmp = "{\"c\":0}";
      }
      else{
        writeTmp = "{\"c\":1}";
      }
       writeStr += writeTmp;
    }
    writeStr += "]]}";
    if(i != (size()-1) ){
      writeStr += ",";
    }
    Serial.println(writeStr);

    esp_task_wdt_reset();  // ウォッチドッグをリセット
    if(fw.println( writeStr )){ 	// ファイルに書き込み
      Serial.println("File written");
    }
    else{
      Serial.println("Write failed");
    }
    esp_task_wdt_reset();  // ウォッチドッグをリセット
  }

  fw.close();	// ⑧ファイルを閉じる
  Serial.println("SPIFFS Write:");	// ⑨書き込み完了をモニタに表示

  return;
}

/**
 * @brief LEDデータをJsonファイルから読み込む
 *
 * このメソッドは、指定されたパスのJsonファイルを開き、その内容を読み込みます。
 * ファイルは行単位で読み込まれ、各行は `jsData.parseJson` メソッドに渡されて解析されます。
 * ファイルが正常に開けなかった場合、エラーメッセージが出力されてメソッドは終了します。
 *
 * @param path 読み込むJsonファイルのパス
 */
void jsonData::readJsonFile(const char *path)
{
  Serial.println("-- jsonData::readJsonFile --");
  Serial.println(path);

  File file = SPIFFS.open(path, "r");
  if(!file){
    Serial.println("Failed to open file for reading");
    return;
  }
  else{
    String readStr;
    while(file.available()){
      readStr = file.readStringUntil('\n'); // 改行まで１行読み出し
      Serial.println(readStr.length());
//      Serial.println(readStr);
      jsData.parseJson(readStr,false,false);
    }
  }
  file.close();

  return;
}

/**
 * @brief LED表示データ番号取得
 * 
 * @return uint8_t データ番号
 */
uint8_t jsonData::getDataNumber(void)
{
  return dataNumber;
}

/**
 * @brief LED表示データ切り替え
 * ドットマトリクスに表示するデータの切り替えを行う
 * 
 * @param keydata キー入力データ
 */
void jsonData::ledDisplayCtrl(uint8_t keydata)
{
  // 表示データ　ファイル読み込み
  if((keydata == 0x02) && (!dataFilePath.empty())){
    dataNumber++;
    if(dataNumber >= jsData.dataFilePath.size()){
      dataNumber = 0;
    }
    readLedDataFile();
//    writeJsonFile();    // dataNumber更新（設定値書き込み
  }

  return;
}

/**
 * @brief   LEDデータをJsonファイルから読み込む
 * 
 * @param page  ページ番号
 * @return std::vector<uint8_t> LEDデータ
 */
std::vector<uint8_t> jsonData::getPageData(void)  // 任意のページのLEDデータ取得
{
  std::vector<uint8_t> tmpdata;
  std::vector<uint8_t> ret;
  if((ledAllData.size()-1)>= pageCount){
    portENTER_CRITICAL(&jsonMutex);
    tmpdata = ledAllData[pageCount];
    portEXIT_CRITICAL(&jsonMutex);

    if(dataType == DataType::rgbData){
      // カラーデータ(7色) -> 単色データ変換
      uint8_t mxData;   // マトリクスデータ(8dot = 1byte)
      uint8_t num;      // データ番号
      for(uint8_t col = 0; col < _col; col++){
        mxData = 0;
        for(uint8_t row = 0; row < _row; row++){
          num = row * _col + col;
          if(tmpdata[num] != 0){
            mxData |= (1 << row);
          }
        }
        ret.push_back(mxData);
      }
    }
    else if(dataType == DataType::monoData){
      // 単色データ
      ret = tmpdata;
    }
    pageCountAdd();   // ページ位置進める
  }
  return ret;
}

/**
 * @brief   ページ位置進める
 * 
 */
void jsonData::pageCountAdd(void)                   // ページ位置進める
{
  portENTER_CRITICAL(&jsonMutex);
  pageCount++;
  if(pageCount >= ledAllData.size()){
    pageCount = 0;
  }
  portEXIT_CRITICAL(&jsonMutex);
  return;
}

void jsonData::paseCountClear(void)
{
  portENTER_CRITICAL(&jsonMutex);
  pageCount = 0;
  portEXIT_CRITICAL(&jsonMutex);
  return;
}


/**
 * @brief   LEDデータをJsonファイルから読み込む
 * 
 * @param page  ページ番号
 * @return std::vector<uint8_t> LEDデータ
 */
std::vector<uint8_t> jsonData::getPageSaveData(uint8_t page)  // 任意のページのLEDデータ取得
{
  std::vector<uint8_t> tmpdata;
  std::vector<uint8_t> ret;
  if((ledAllData.size()-1)>= page){
    portENTER_CRITICAL(&jsonMutex);
    tmpdata = ledAllData[page];
    portEXIT_CRITICAL(&jsonMutex);
/*
    if(dataType == DataType::rgbData){
      // カラーデータ(7色) -> 単色データ変換
      uint8_t mxData;   // マトリクスデータ(8dot = 1byte)
      uint8_t num;      // データ番号
      for(uint8_t col = 0; col < _col; col++){
        mxData = 0;
        for(uint8_t row = 0; row < _row; row++){
          num = row * _col + col;
          if(tmpdata[num] != 0){
            mxData |= (1 << row);
          }
        }
        ret.push_back(mxData);
      }
    }
    else if(dataType == DataType::monoData){
      // 単色データ
    }
*/
  }
  return tmpdata;
}

/**
 * @brief   LEDデータ表示方向回転処理
 * 
 * @param data 
 * @return std::vector<uint8_t> 
 */
std::vector<uint8_t> jsonData::dataRotation(std::vector<uint8_t> data)    // LEDデータ表示方向回転処理
{
  // データ回転処理
  if(!rotatePosition){
    std::reverse(data.begin(), data.end());
    for (auto& byte : data) {
      byte = reverseBits(byte);
    }
  }

  return data;
}

/**
 * @brief   ビット反転処理
 * 
 * @param num 
 * @return uint8_t 
 */
uint8_t jsonData::reverseBits(uint8_t num) {
  uint8_t result = 0;
  for (int i = 0; i < 8; i++) {
    result <<= 1; // resultを左に1ビットシフト
    if (num & 1) { // numの最下位ビットが1かどうかをチェック
      result |= 1; // resultの最下位ビットを1に設定
    }
    num >>= 1; // numを右に1ビットシフト
  }
  return result;
}


uint8_t jsonData::size(void)
{
  uint8_t ret;

  portENTER_CRITICAL(&jsonMutex);
  ret = ledAllData.size();
  portEXIT_CRITICAL(&jsonMutex);

  return ret;
}

uint8_t jsonData::empty(void)
{
  uint8_t ret;

  portENTER_CRITICAL(&jsonMutex);
  ret = ledAllData.empty();
  portEXIT_CRITICAL(&jsonMutex);

  return ret;
}

void jsonData::filepathAdd(std::string path)
{
  auto it = std::find(dataFilePath.begin(), dataFilePath.end(), path);
  if(it == dataFilePath.end()){
//    Serial.println("filepathAdd");
    dataFilePath.insert(dataFilePath.begin(),path);
  }
  filepathIni();    // データリスト更新

  return;
}

// ファイル名に "sample" を含むかどうかを判定する関数
bool jsonData::containsSample(const std::string& path) {
    return path.find("sample") != std::string::npos;
}

// "sample" を含むパスを削除するメンバ関数
void jsonData::removeSampleFiles() {
  // ラムダ式を使用して非静的メンバ関数を呼び出す
  dataFilePath.erase(
    std::remove_if(dataFilePath.begin(), dataFilePath.end(), 
      [this](const std::string& path) { return containsSample(path); }),
    dataFilePath.end()
  );
}

/**
 * @brief jsonDataオブジェクトのファイルリストを初期化する。
 * 
 * この関数はjsonDataオブジェクトが操作に使用するファイルリストの設定を行う。
 * jsonDataオブジェクトの他の操作を行う前に呼び出すことが期待されている。
 * データファイルの更新が行われた場合、この関数を呼び出すことで、リストを更新することができる
 * データファイルのリストに、サンプルデータを含めるかどうかは、jsonDataオブジェクトのshowSampleDataメンバ変数によって制御される。

 * @return true ファイルリストにファイルがある場合
 * @return false ファイルリストにファイルがない場合
 */
bool jsonData::filepathIni(void)
{
  Serial.printf("filepathIni\n");
  dataFilePath.clear();   // データリスト初期化

  File root = SPIFFS.open("/data");
  if(!root){
    Serial.println("Failed to open directory");
    return false;
  }
  File file = root.openNextFile();
  while(file){
    esp_task_wdt_reset();  // ウォッチドッグをリセット
    if(!file.isDirectory()){
      String dataPath = "/data/" + String(file.name());
      jsData.dataFilePath.push_back(dataPath.c_str());
      Serial.println(dataPath);
    }
    file = root.openNextFile();
  }

  // "sample" を含むパスを削除
  if(showSampleData == 0){
    removeSampleFiles();
  }

  // ファイル名でソートする
  std::sort(jsData.dataFilePath.begin(), jsData.dataFilePath.end());

  // dataFilePathの内容のうち、filenameに設定されているファイル名があれば、そのインデックスを取得
  auto it = std::find(dataFilePath.begin(), dataFilePath.end(), filename);
  if(it != dataFilePath.end()){
    // filenameに設定されているファイル名があれば、そのインデックスを取得し、dataNumberに設定する
    // 表示されるデータとdataNumberの値が一致するようにする
    dataNumber = std::distance(dataFilePath.begin(), it);
    Serial.printf("filename index : %d\n",dataNumber);
    writeJsonFile();    // dataNumber更新（設定値書き込み
  }

  return dataFilePath.empty();
}

/**
 * @brief   LEDデータファイル読み込み
 * 
 * @return true     データファイル読み込み成功
 * @return false    データファイル読み込み失敗
 */
bool jsonData::readLedDataFile(void)               // LED表示データファイル読み込み 
{
  bool ret = false;
  if(!dataFilePath.empty()){
    uint8_t dataNum;
    if(dataFilePath.size() > dataNumber){
      dataNum = dataNumber;  // データファイルがある場合、前回表示していたデータ番号のファイル読み込む
    }
    else{
      dataNum = 0;  // データファイルがない場合、最初のデータを対象とする
    }
    readJsonFile(dataFilePath[dataNum].c_str());  // データファイルがある場合、最初のデータを読み込む
    ret = true;
  }
  else{
    // データファイルがない場合の表示データが必要？
    Serial.println("dataFile empty");
  }

  return ret;
}

/**
 * @brief setting.json作製・書き込み
 * 
 */
void jsonData::writeJsonFile(void){
  Serial.println("== writeJsonFile ==");

  String configData = "";

  configData = configData + makeJsonPiece("glowInTheBright", jsData.glowInTheBright, true);       // 表示輝度
  configData = configData + makeJsonPiece("rotatePosition", jsData.rotatePosition, true);         // 表示方向
  configData = configData + makeJsonPiece("dotColor", dotColor, true);                            // WebIFマトリクスエディタ表示色設定
  configData = configData + makeJsonPiece("showSampleData", showSampleData, true);                // サンプルデータ表示
  configData = configData + makeJsonPiece("dataNumber", dataNumber, true);                        // 表示データ番号
  configData = configData + makeJsonPiece("staStartupConnect", staStartupConnect, true);          // STA起動時接続設定
  configData = configData + makeJsonPiece("staReConnectInterval", staReConnectInterval, true);    // STA再接続間隔
  configData = configData + makeJsonPiece("soundEnable", soundEnable, true);                      // サウンド有効設定
  configData = configData + makeJsonPiece("clockScrollTime", clockScrollTime, false);             // 時計スクロール時間

  Serial.println(configData);

  File fp = SPIFFS.open("/setting.json","w");
  if( fp ){
    fp.print(configData);
    fp.close();
  }
  else{
    Serial.println("Flash Write Error");
  }

  Serial.println("[E]");
  return;
}

/**
 * @brief jsonデータ作成:String
 * 
 * @param key     jsonのキー
 * @param value   jsonの値
 * @param connma  true:データの最後に「.」を追加する
 *                false:追加しない
 * @return String 
 */
String jsonData::makeJsonPiece(String key, String value ,bool connma)
{
  String ret = "{\"" + key + "\":" + value + "}";
  if(connma == true){
    ret = ret + ",";
  }
  ret = ret + "\n";
  return ret;
}

/**
 * @brief jsonデータ作成:uint8_t
 * 
 * @param key     jsonのキー
 * @param value   jsonの値
 * @param connma  true:データの最後に「.」を追加する
 *                false:追加しない
 * @return String 
 */
String jsonData::makeJsonPiece(String key, uint8_t value ,bool connma)
{
  String ret = "{\"" + key + "\":" + value + "}";
  if(connma == true){
    ret = ret + ",";
  }
  ret = ret + "\n";
  return ret;
}

/**
 * @brief jsonデータ作成:uint16_t
 * 
 * @param key     jsonのキー
 * @param value   jsonの値
 * @param connma  true:データの最後に「.」を追加する
 *                false:追加しない
 * @return String 
 */
String jsonData::makeJsonPiece(String key, uint16_t value ,bool connma)
{
  String ret = "{\"" + key + "\":" + value + "}";
  if(connma == true){
    ret = ret + ",";
  }
  ret = ret + "\n";
  return ret;
}


//=====
/**
 * @brief setting.jsを作製する
 * 
 * @return String 
 */
String makeSettingjs(void){
  Serial.println("== makeSettingjs ==");
  String html_tmp = "";
  String stringTmp;

  html_tmp = html_tmp + (String)"var _initial_setting_ = \'{\\\n";

  // ネットワーク情報は接続状態によるので、値のチェックを行う。
  // StationMode SSID
  stringTmp = getWifiStaSsid();
  if(stringTmp.length() != 0){
    html_tmp = html_tmp + (String)"\"stamodeSSID\" : \"" + stringTmp + (String)"\",\\\n";
  }
  else{
    html_tmp = html_tmp + (String)"\"stamodeSSID\" : \"\",\\\n";
  }
  // StationMode IP Adress
  stringTmp = getWifiStaIpadr();
  if(stringTmp.length() != 0){    // todo. 0.0.0.0を検出して分岐するように修正必要。
    html_tmp = html_tmp + (String)"\"stamodeIP\" : \"" + stringTmp + (String)"\",\\\n";
  }
  else{
    html_tmp = html_tmp + (String)"\"stamodeIP\" : \"\",\\\n";
  }
  // APMode SSID
  stringTmp = getWifiApSsid();
  if(stringTmp.length() != 0){
    html_tmp = html_tmp + (String)"\"atmodeSSID\" : \"" + stringTmp + (String)"\",\\\n";
  }
  else{
    html_tmp = html_tmp + (String)"\"atmodeSSID\" : \"\",\\\n";
  }
  // APMode IP Adress
  stringTmp = getWifiApIpadr();
  if(stringTmp.length() != 0){
    html_tmp = html_tmp + (String)"\"atmodeIP\" : \"" + stringTmp + (String)"\",\\\n";
  }
  else{
    html_tmp = html_tmp + (String)"\"atmodeIP\" : \"\",\\\n";
  }

  // LED表示設定
  html_tmp = html_tmp + (String)"\"glowInTheBright\" : " + jsData.glowInTheBright + ",\\\n";  
  html_tmp = html_tmp + (String)"\"rotatePosition\" : " + jsData.rotatePosition + ",\\\n";  

  // WebIF画面設定
  html_tmp = html_tmp + (String)"\"dotColor\" : " + jsData.dotColor + ",\\\n";

  // サンプルデータ表示設定
  html_tmp = html_tmp + (String)"\"showSampleData\" : " + jsData.showSampleData + ",\\\n";

  // 表示データ番号設定
  html_tmp = html_tmp + (String)"\"dataNumber\" : " + jsData.getDataNumber() + ",\\\n";

  // STA起動時接続設定
  html_tmp = html_tmp + (String)"\"staStartupConnect\" : " + jsData.staStartupConnect + ",\\\n";

  // STA再接続間隔
  html_tmp = html_tmp + (String)"\"staReConnectInterval\" : " + jsData.staReConnectInterval + ",\\\n";

  // サウンド有効設定
  html_tmp = html_tmp + (String)"\"soundEnable\" : " + jsData.soundEnable + ",\\\n";

  // 時計スクロール時間
  html_tmp = html_tmp + (String)"\"clockScrollTime\" : " + jsData.clockScrollTime + "\\\n";

  html_tmp = html_tmp + String("}\';");

  Serial.println(html_tmp);
  return(html_tmp);
};
