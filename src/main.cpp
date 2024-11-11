/**
 * @file main.cpp
 * @author hayasita04@gmail.com
 * @brief DotMatrixer
 * @version 0.1
 * @date 2024-03-10
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#include <M5Unified.h>
#include <M5UnitOLED.h>
#include <SPIFFS.h>
#include <Wire.h>

#include "dotserver.h"
#include <ArduinoJson.h>
#include "jsdata.h"

#include "monitor_real_device.h"
#include "monitor.h"
#include "matrix_driver.h"
#include "device_driver.h"
#include "filesys.h"
#include "i2c_driver.h"
#include "imu.h"
#include "led_ctrl.h"
#include "sdCard.h"
#include "sound_ctrl.h"
#include "timeCtrl.h"
#include "wifi_real.h"
#include "wifi_ctrl.h"
#include "sand.h"

#if defined (M5STACK_CORE_ESP32_Tester)
  #include <M5GFX.h>
//  M5GFX display;
  //M5Canvas canvas(&display);

  void allScan(void);
  void i2cScan(void);

#endif
void i2cScan(void)
{
  M5.Display.print("i2cScan()!\n");
  return;
}

/**
 * @brief デバイス制御タスク
 * 
 * @param Parameters 
 */
void taskDeviceCtrl(void *Parameters){

#if defined (M5STACK_CORE_ESP32_Tester)
  M5.Display.print("taskDeviceCtrl()!\n");
#endif

/*
  if (!M5.Rtc.isEnabled())
  {
    Serial.println("RTC not found.");
    for (;;) { M5.delay(500); }
  }
  Serial.println("RTC found.");
*/
  // serialMonitor init
  RealMonitorDeviseIo real;
  SerialMonitor serialMonitor(&real);

  // 時計制御
  ClockCtrl clockCtrl;

  // WiFi接続制御 init
  WiFi_real wifiReal;
  WiFiConnect wifiConnect(&wifiReal);
  setWiFihandle(&wifiConnect);          // Set WiFi Call Back.
  jsData.wifiPSet(&wifiConnect);        // WiFi接続情報設定

  // M5 LED Control
  LEDControl led;

  // i2cCtrl
  i2cCtrl _i2cCtrl;
  _i2cCtrl.init();
  jsData.i2cPSet(&_i2cCtrl);            // I2C制御ポインタ設定

  // I2C Device Check
  DeviceChk deviceChk;
  deviceChk.i2cScan();

  IMU _imu(deviceChk.imu());
  _imu.whoAmI();
  _imu.init();
  jsData.imuPSet(&_imu);                // IMU制御ポインタ設定

  // I2C OLED Display
  M5OLED m5Oled(deviceChk.m5oled());
  DisplayData oledData;

  // JSONファイルデータ読み込み
  jsData.readJsonFile("/setting.json"); // 設定ファイル読み込み
  jsData.filepathIni();                 // データファイルのリスト初期化
  jsData.readLedDataFile();             // データファイル読み込み
  _imu.setOffset(jsData.imuCalibrateData);     // IMUオフセット設定

  // 端子入力初期化
  unsigned char swList[] = {BUTTON_0,BUTTON_1};
  ITM itm(swList,sizeof(swList));

  // タイマー表示
  dispTimer displayTimer;

  // 表示モード設定
  modeCtrl *_dispMode = &jsData.dispMode;
  displayTitle *_dispTitle = &jsData.dispTitle;               // タイトル表示制御
  _dispTitle->makeTitle(jsData.getDataNumber(),*_dispMode);   // タイトル初期値作成
  _dispMode->_displayTimer = &displayTimer;                    // タイマー表示モード設定

/*
  char bufc[100];
  // time_t のバイト数、ビット数
  sprintf( bufc, "sizeof(time_t) : %d bytes (%d bits) \n", sizeof(time_t), sizeof(time_t)*8 );
  Serial.print(bufc);
*/

  // 時計表示データ生成
  dispClock displayClock;

  // 起動時のWiFi接続処理要求設定
  wifiConnect.forceConnect();

  // 砂表示
  Sand sand;

#ifndef M5STACK_CORE_ESP32_Tester   //M5.Display.print()は、ここがあると出力されない
  // 起動音PiPo
  if(uxQueueSpacesAvailable(xQueueSoundPlay) != 0){             // キューの追加可能数が0ではない
//    uint8_t keyData = (uint8_t)SoundReqPr::SOUND_PLAY3;         // SoundTaskへのタスク間通信データ
    SoundReqPr keyData = SoundReqPr::SOUND_PLAY3;         // SoundTaskへのタスク間通信データ
    BaseType_t ret = xQueueSend(xQueueSoundPlay, &keyData, 0);
    if(ret == pdPASS){
      Serial.println("SoundTask Start.");
    }
    else{
      Serial.println("SoundTask Start Error.");
    }
  }
#endif

  while(1){
    static unsigned long ledLasttime = millis(); 
    static unsigned long clockDisptLasttime = millis(); 
    static unsigned long sandLasttime = millis();
    unsigned long timetmp;      // millis()tmp
    uint8_t itmKeyCode;

    IMU_FILTER_DATA filterData;   // IMUフィルタデータ

    timetmp = millis();               // 処理間隔確認用基本時刻

#if defined (M5STACK_CORE_ESP32_Tester)
    M5.update();
    if (M5.BtnA.wasSingleClicked()) {
      Serial.println("M5.BtnA.wasSingleClicked()");
      M5.Display.print("M5.BtnA.wasSingleClicked()\n");
      i2cScan();
      allScan();              // I2Cデバイス全検索
//      _imu.displayWhoAmI();    // IMUの識別情報表示
    }
    else if (M5.BtnB.wasSingleClicked()) {
      Serial.println("M5.BtnB.wasSingleClicked()");
      _imu.displayWhoAmI();    // IMUの識別情報表示
    }
    else if (M5.BtnC.wasSingleClicked()) {
      itmKeyCode = 0x01;
      Serial.println("M5.BtnC.wasSingleClicked()");
    }
    else if(M5.BtnC.wasDoubleClicked()){
      itmKeyCode = 0x81;
      Serial.println("M5.BtnC.wasDoubleClicked()");
    }
    else{
      itmKeyCode = itm.man();
      if(itmKeyCode == 0x02){
        Serial.println("SW1:ON");
        SoundReqPr keyData;    // SoundTaskへのタスク間通信データ
        if(uxQueueSpacesAvailable(xQueueSoundPlay) != 0){             // キューの追加可能数が0ではない
          keyData = SoundReqPr::SOUND_PLAY3;
          xQueueSend(xQueueSoundPlay, &keyData, 0);
        }
      }
    }
#else
    // 端子入力・表示制御
    itmKeyCode = itm.man();
#endif

    if(itmKeyCode == 0x01){   // 表示モード変更
      itmKeyCode = 0x00;
      Serial.println("表示モード変更");
      _dispMode->modeChange(itmKeyCode);  // 表示モード変更
      Serial.println(static_cast<uint8_t>(_dispMode->getCurrentOperationMode()));
      jsData.modeWriteReq();             // モード設定書き込み要求
      _dispTitle->makeTitle(jsData.getDataNumber(),*_dispMode);    // タイトル作成
    }
    else if(itmKeyCode == 0x02){
      if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_TIMER){    // 動作モードがタイマー表示の場合は、動作制御
        if(_dispMode->_displayTimer->timerSq == TimerSq::TIMER_STOP){
          Serial.println("Timer Start.");
          _dispMode->_displayTimer->timerSq = TimerSq::TIMER_RUN; // タイマー開始
        }
        else if(_dispMode->_displayTimer->timerSq == TimerSq::TIMER_RUN){
          if(_dispMode->_displayTimer->isTimerExpired == IsTimerExpired::TIMER_EXPIRED){
            // タイマー状態が動作中で、タイマー設定時間経過状態の場合は、タイマー継続動作中に遷移
            _dispMode->_displayTimer->isTimerExpired = IsTimerExpired::TIMER_EXPIRED_CONTINUING;
          
            SoundReqPr keyData;    // SoundTaskへのタスク間通信データ
            if(uxQueueSpacesAvailable(xQueueSoundPlay) != 0){             // キューの追加可能数が0ではない
              keyData = SoundReqPr::SOUND_STOP;
              xQueueSend(xQueueSoundPlay, &keyData, 0);
            }

          }
        }
        else if(_dispMode->_displayTimer->timerSq == TimerSq::TIMER_EXPIRED){ // タイマー設定時間経過
          Serial.println("Timer Stop.");
          _dispMode->_displayTimer->timerSq = TimerSq::TIMER_RESET; // タイマーリセット
          
          SoundReqPr keyData;    // SoundTaskへのタスク間通信データ
          if(uxQueueSpacesAvailable(xQueueSoundPlay) != 0){             // キューの追加可能数が0ではない
            keyData = SoundReqPr::SOUND_STOP;
            xQueueSend(xQueueSoundPlay, &keyData, 0);
          }

        }
      }
      else if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_IMU){
        // 砂追加
        sand.addGrainRequest();
      }
      else{
        // 動作モードがタイマー表示以外の場合は、表示データ切り替え
        if(_dispMode->displaySelect()){
          // ドットマトリクス以外
        }
        else{
          jsData.ledDisplayCtrl(itmKeyCode); // データファイルがある場合、表示データ制御を行う
        }
        jsData.modeWriteReq();             // モード設定書き込み要求
        _dispTitle->makeTitle(jsData.getDataNumber(),*_dispMode);    // タイトル作成
      }
    }
    else if(itmKeyCode == 0x81){    // WiFi Ctrl
      itmKeyCode == 0x00;
      Serial.println("WiFi Contrl request.");
      wifiConnect.withItm();    // WiFi端子入力要求
    }
    else if(itmKeyCode == 0x82){
      itmKeyCode == 0x00;
      if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_TIMER){
        // タイマー表示の場合は、タイマー設定時間切替
        if(_dispMode->_displayTimer->timerSq == TimerSq::TIMER_STOP){
          // 停止時のみ設定可能
          _dispMode->displaySelect();
          jsData.modeWriteReq();             // モード設定書き込み要求
          _dispTitle->makeTitle(jsData.getDataNumber(),*_dispMode);    // タイトル作成
        }
      }
      else if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_IMU){
        // 砂一行削除
        sand.removeGrainRequest();
      }
      else{
        // 動作テスト
        // SDカードデータ読み込み
        sdcard.listDir(SD, "/", 3);
        // デバイス確認
        deviceChk.init();
        _imu.whoAmI();
/*
        SoundReqPr keyData;    // SoundTaskへのタスク間通信データ
        if(uxQueueSpacesAvailable(xQueueSoundPlay) != 0){             // キューの追加可能数が0ではない
          keyData = SoundReqPr::SOUND_PLAY1;
          xQueueSend(xQueueSoundPlay, &keyData, 0);
        }
*/
      }
    }
    jsData.modeWrite();     // モード設定書き込み

  // 接続要求：タイマー
    wifiConnect.withTimer();

    wifiConnect.manager();

    if(wifiConnect.getWiFiConSts() == WiFiConSts::STA_DISCONNECTION){    // STA切断
      oledData.lastConnectTime = clockCtrl.getTime();
    }

    // WiFiStationList取得要求
    wifiScanSta();

    if(wifiStaReconnect == 1){
      wifiStaReconnect = 0;
      wifiConnect.withStaReconnect();    // WiFi再接続要求
    }

    if(timetmp - clockDisptLasttime > 100){     // 時刻表示確認
      clockDisptLasttime = timetmp;
      // 時計データ更新
      oledData.timeInfo = clockCtrl.getTime();

      // M5OLED表示
//      m5Oled.printClockData(oledData);
      m5Oled.printIMUData(filterData);  // IMUデータ表示
//      m5Oled.printIMUData(filterData);

/*
      static constexpr const char* const wd[7] = {"Sun","Mon","Tue","Wed","Thr","Fri","Sat"};
      auto dt = M5.Rtc.getDateTime();
//      M5.Display.setCursor(0,0);
      Serial.printf("RTC   UTC  :%04d/%02d/%02d (%s)  %02d:%02d:%02d\r\n"
                  , dt.date.year
                  , dt.date.month
                  , dt.date.date
                  , wd[dt.date.weekDay]
                  , dt.time.hours
                  , dt.time.minutes
                  , dt.time.seconds
                  );
*/
    }

    // IMUデータ取得
    if(jsData.imuCalibrateEx()){
      jsData.imuCalibrateData = _imu.calibrate();
      jsData.writeJsonFile();
      Serial.printf("offsetX : %6f\n", jsData.imuCalibrateData.offsetX);
      Serial.printf("offsetY : %6f\n", jsData.imuCalibrateData.offsetY);
      Serial.printf("offsetZ : %6f\n", jsData.imuCalibrateData.offsetZ);
      Serial.printf("offsetAngleX : %6f\n", jsData.imuCalibrateData.offsetAngleX);
      Serial.printf("offsetAngleY : %6f\n", jsData.imuCalibrateData.offsetAngleY);
    }
    else{
      filterData = _imu.complementaryFilter();
//      m5Oled.printIMUData(filterData);
    }

    if(_dispTitle->getDisplayTitleSq() == DisplayTitleSq::DISP_TITLE){  // タイトル表示
      // タイトル表示
      if(timetmp - ledLasttime > 100){     // 更新時間確認
        std::vector<uint8_t> titleData = _dispTitle->getTitleData();
        // データ回転処理
        titleData = jsData.dataRotation(titleData);
        // LEDマトリクスデータ転送
        _i2cCtrl.matrixsetHexdata(titleData);
      }
    }
    else{

      // Matrix Display Control
      if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_DOTTER){  // ドットマトリクス表示
        if(timetmp - ledLasttime > jsData.animationTime){     // 更新時間確認
          ledLasttime = timetmp;  // 更新時間設定
          if(!jsData.empty()){
            // データ取得
            std::vector<uint8_t> pageData = jsData.getPageData();
            // データ回転処理
            pageData = jsData.dataRotation(pageData);
            // VK16K33 Matrix Driver
            _i2cCtrl.matrixsetHexdata(pageData);
          }
          else{
            jsData.paseCountClear();
          }
        }
      }
      else if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_CLOCK){  // 時計表示
        // 時計データ更新
        if(timetmp - ledLasttime > jsData.clockScrollTime){     // 更新時間確認
          ledLasttime = timetmp;  // 更新時間設定
          // 時計データ更新
          std::vector<uint8_t> pageData = displayClock.makeData(oledData.timeInfo,_dispMode->getClockDispMode());
          // データ回転処理
          pageData = jsData.dataRotation(pageData);
          // LEDマトリクスデータ転送
          _i2cCtrl.matrixsetHexdata(pageData);
        }
      }
      else if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_TIMER){  // タイマー表示
        // タイマーデータ更新
        std::vector<uint8_t> pageData = displayTimer.makeData(_dispMode->gettimerDispMode());
        // データ回転処理
        pageData = jsData.dataRotation(pageData);
        // LEDマトリクスデータ転送
        _i2cCtrl.matrixsetHexdata(pageData);

        if(soundReq != SoundReqPr::SOUND_OFF){
          SoundReqPr keyData;    // SoundTaskへのタスク間通信データ
          if(uxQueueSpacesAvailable(xQueueSoundPlay) != 0){             // キューの追加可能数が0ではない
            keyData = soundReq;
            xQueueSend(xQueueSoundPlay, &keyData, 0);
          }
          soundReq = SoundReqPr::SOUND_OFF;
        }
      }
      else if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_IMU){   // IMU表示
        // 砂落下表示
        sand.autoGrainRequest();
        if(timetmp - sandLasttime > 10){      // 更新時間確認
          sandLasttime = timetmp;             // 更新時間設定
          // 砂表示データ作成
          std::vector<uint8_t> pageData = sand.grainRoll(filterData.gyro_angle_x,filterData.gyro_angle_y);
          // LEDマトリクスデータ転送
          _i2cCtrl.matrixsetHexdata(pageData);
          // IMUデータ表示
//          m5Oled.printSandData(sand);
        }
      }
    }

    // M5ATOM Matrix LED 
    if(wifiConnect.getWiFiConSts() == WiFiConSts::NOCONNECTION){           // WiFi接続なし
      led.set(0, CRGB::Red, LEDPATTERN_ALLON);
//#if defined (M5STACK_ATOMS3)
//      M5.Display.clear(BLACK);
      M5.Display.setCursor(0, 0);
      M5.Display.setTextSize(1.4);
      M5.Display.print("                   ");
//      M5.Display.print("WiFi Disconnection.");
//#endif
    }
    else if( (wifiConnect.getWiFiConSts() == WiFiConSts::MAN_CONNECT)       // WiFi接続完了
          || (wifiConnect.getWiFiConSts() == WiFiConSts::SNTPAUTO_CONNECT)  // SNTP自動接続・SNTP処理完了まち
      ){
      led.set(0, CRGB::Green, LEDPATTERN_ALLON);
//#if defined (M5STACK_ATOMS3)
//      M5.Display.clear(BLACK);
      M5.Display.setCursor(0, 0);
      M5.Display.setTextSize(1.4);
      M5.Display.print("WiFi Connection.   ");
//#endif
    }
    else{
      led.set(0, CRGB::Green, LEDPATTERN_ONEBEAT);  // WiFi接続・切断処理中
//#if defined (M5STACK_ATOMS3)
//      M5.Display.clear(BLACK);
      M5.Display.setCursor(0, 0);
      M5.Display.setTextSize(1.4);
      M5.Display.print("WiFi Connecting.   ");
//#endif
    }
    led.man();

    // シリアルモニタ処理
    serialMonitor.exec();

    // SD Card Check
    sdcard.cardChk();

    delay(1);
  }

}


/**
 * @brief setup
 * 
 */
void setup() {
  auto cfg = M5.config();
//  cfg.external_rtc  = true;  // default=false. use Unit RTC.
  M5.begin(cfg);
  M5.In_I2C.release();

  Serial.begin(115200);
//  while (!Serial);

#if defined (M5STACK_CORE_ESP32_Tester)
  M5.Display.setRotation(3);
  M5.Display.clear(BLACK);
  M5.Display.print("Hello, M5Stack Core ESP32 Tester!\n");
#elif defined (M5STACK_ATOMS3)
  // ATOMS3 Display
  M5.Display.setRotation(2);
  M5.Display.clear(BLACK);
#endif

  // Initialize SPIFFS
  if(!SPIFFS.begin()){
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  // SD Card
  sdcard.init();

  // Setting Web Server
  setWebhandle();       // Web handle setting

  // フラグ初期化
  getwifiStaListreq = 0;  // WiFiStationList取得要求
  wifiStaReconnect = 0;   // STA再接続要求セット

    // キュー作成
  xQueueSoundPlay = xQueueCreate(QUEUE_SOUNDLENGTH, sizeof(SoundReqPr));
//  xQueueSoundPlay = xQueueCreate(QUEUE_SOUNDLENGTH, sizeof(uint8_t));

  // Core1で関数taskSoundCtrlをstackサイズ4096,優先順位1で起動
  xTaskCreatePinnedToCore(taskSoundCtrl,"taskSoundCtrl",4096,NULL,1,&sountaskHandle,1);

  // Core1で関数taskDeviceCtrlをstackサイズ4096,優先順位1で起動
  xTaskCreatePinnedToCore(taskDeviceCtrl, "taskDeviceCtrl", 4096, NULL, 1, NULL, 1);
}

/**
 * @brief main loop
 * 
 */
void loop() {
  // WebSocketのクライアントをクリーンアップ
  wsCleanupClients();

  delay(1);
}

#if defined (M5STACK_CORE_ESP32_Tester)
/**
 * @brief I2Cデバイス全検索
 * 
 */
/*
void allScan(void)
{
  display.begin();
  display.setRotation(3);
  display.fillScreen(BLACK);
  display.setCursor(0, 8);
  display.setTextSize(1);

  display.printf("I2C Scan\n");
  Serial.printf("===================\n");
  Serial.printf("I2C Scan\n");

  display.println();
  display.printf("SDA:%2d SCL:%2d\n", (uint8_t)SDA, (uint8_t)SCL);
  Serial.println();
  Serial.printf("SDA:%2d SCL:%2d\n", (uint8_t)SDA, (uint8_t)SCL);

  for (byte address = 0; address <= 127; address++) {
    Wire.beginTransmission(address);
    byte error = Wire.endTransmission();

    if (error == 0) {
      display.printf("%02X ", address);
      Serial.printf("%02X ", address);
    } else {
      if (240 <= display.width()) {
        display.print(".. ");
        if (address % 16 == 15) {
          display.println();
        }
      }
    }
    delay(1);
  }

  display.println();
  Serial.println();
  display.endWrite();
  return;

}
*/

void allScan(void)
{
  M5.Display.begin();
  M5.Display.setRotation(3);
  M5.Display.fillScreen(BLACK);
  M5.Display.setCursor(0, 8);
  M5.Display.setTextSize(1);

  M5.Display.printf("I2C Scan\n");
  Serial.printf("===================\n");
  Serial.printf("I2C Scan\n");

  M5.Display.println();
  M5.Display.printf("SDA:%2d SCL:%2d\n", (uint8_t)SDA, (uint8_t)SCL);
  Serial.println();
  Serial.printf("SDA:%2d SCL:%2d\n", (uint8_t)SDA, (uint8_t)SCL);

  for (byte address = 0; address <= 127; address++) {
    Wire.beginTransmission(address);
    byte error = Wire.endTransmission();

    if (error == 0) {
      M5.Display.printf("%02X ", address);
      Serial.printf("%02X ", address);
    } else {
      if (240 <= M5.Display.width()) {
        M5.Display.print(".. ");
        if (address % 16 == 15) {
          M5.Display.println();
        }
      }
    }
    delay(1);
  }

  M5.Display.println();
  Serial.println();
  M5.Display.endWrite();

  return;
}


#endif
