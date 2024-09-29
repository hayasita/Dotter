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
#include <SPIFFS.h>

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
#include "timeCtrl.h"
#include "wifi_real.h"
#include "wifi_ctrl.h"

/**
 * @brief デバイス制御タスク
 * 
 * @param Parameters 
 */
void taskDeviceCtrl(void *Parameters){

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

  // I2C Device Check
  DeviceChk deviceChk;
  deviceChk.i2cScan();

  IMU _imu(deviceChk.imu());
  _imu.whoAmI();
  _imu.init();

  // I2C OLED Display
  M5OLED m5Oled(deviceChk.m5oled());
  DisplayData oledData;

  // JSONファイルデータ読み込み
  jsData.readJsonFile("/setting.json"); // 設定ファイル読み込み
  jsData.filepathIni();                 // データファイルのリスト初期化
  jsData.readLedDataFile();             // データファイル読み込み

  // 端子入力初期化
  unsigned char swList[] = {BUTTON_0,BUTTON_1};
  ITM itm(swList,sizeof(swList));

  // 表示モード設定
  modeCtrl *_dispMode = &jsData.dispMode;
  displayTitle *_dispTitle = &jsData.dispTitle;               // タイトル表示制御
  _dispTitle->makeTitle(jsData.getDataNumber(),*_dispMode);   // タイトル初期値作成

  char bufc[100];
  // time_t のバイト数、ビット数
  sprintf( bufc, "sizeof(time_t) : %d bytes (%d bits) \n", sizeof(time_t), sizeof(time_t)*8 );
  Serial.print(bufc);

  // 時計表示データ生成
  dispClock displayClock;

  // 起動時のWiFi接続処理要求設定
  wifiConnect.forceConnect();

  setToneChannel(0);
  const int soundPin = SOUND_PIN;
  if(jsData.soundEnable == 1){
    // sound init PiPo
    tone(soundPin, 2000, 100);
    tone(soundPin, 1000, 100);
  //  tone(soundPin, 500, 100);
  //  tone(soundPin, 250, 100);
    noTone(soundPin);
  }

  while(1){
    static unsigned long ledLasttime = millis(); 
    static unsigned long clockDisptLasttime = millis(); 
    unsigned long timetmp;      // millis()tmp
    uint8_t itmKeyCode;

    timetmp = millis();               // 処理間隔確認用基本時刻

    // 端子入力・表示制御
    itmKeyCode = itm.man();

    if(itmKeyCode == 0x01){   // 表示モード変更
      itmKeyCode = 0x00;
      Serial.println("表示モード変更");
      _dispMode->modeChange(itmKeyCode);  // 表示モード変更
      Serial.println(static_cast<uint8_t>(_dispMode->getCurrentOperationMode()));

      _dispTitle->makeTitle(jsData.getDataNumber(),*_dispMode);    // タイトル作成
    }
    else if(itmKeyCode == 0x02){
      jsData.ledDisplayCtrl(itmKeyCode); // データファイルがある場合、表示データ制御を行う
      jsData.modeWriteReq();             // モード設定書き込み要求

      _dispTitle->makeTitle(jsData.getDataNumber(),*_dispMode);    // タイトル作成
    }
    else if(itmKeyCode == 0x81){    // WiFi Ctrl
      itmKeyCode == 0x00;
      Serial.println("WiFi Contrl request.");
      wifiConnect.withItm();    // WiFi端子入力要求
    }
    else if(itmKeyCode == 0x82){
      itmKeyCode == 0x00;
      // SD
      sdcard.listDir(SD, "/", 3);

      deviceChk.init();
      _imu.whoAmI();

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

      // IMUデータ取得
      IMU_RAW_DATA imuData;
      IMU_RAW_DATA imuData2;
      _imu.getRawData(&imuData);
      imuData2 = _imu.calcIMUMovAvg(imuData);

      // M5OLED表示
      m5Oled.printClockData(oledData);
      m5Oled.printIMUData(imuData2);

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
      if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_CLOCK){  // 表示モード0(時計表示
          // 時計データ更新
        if(timetmp - ledLasttime > jsData.clockScrollTime){     // 更新時間確認
          ledLasttime = timetmp;  // 更新時間設定
          // 時計データ更新
          std::vector<uint8_t> pageData = displayClock.makeData(oledData.timeInfo);
          // データ回転処理
          pageData = jsData.dataRotation(pageData);
          // LEDマトリクスデータ転送
          _i2cCtrl.matrixsetHexdata(pageData);
        }
      }
      else if(_dispMode->getCurrentOperationMode() == OperationMode::MODE_DOTTER){  // 表示モード1(マトリクスデータ表示)
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
    }

    // M5ATOM Matrix LED 
    if(wifiConnect.getWiFiConSts() == WiFiConSts::NOCONNECTION){           // WiFi接続なし
      led.set(0, CRGB::Red, LEDPATTERN_ALLON);
    }
    else if( (wifiConnect.getWiFiConSts() == WiFiConSts::MAN_CONNECT)       // WiFi接続完了
          || (wifiConnect.getWiFiConSts() == WiFiConSts::SNTPAUTO_CONNECT)  // SNTP自動接続・SNTP処理完了まち
      ){
      led.set(0, CRGB::Green, LEDPATTERN_ALLON);
    }
    else{
      led.set(0, CRGB::Green, LEDPATTERN_ONEBEAT);  // WiFi接続・切断処理中
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
