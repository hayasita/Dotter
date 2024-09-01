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
#include "display_ctrl.h"
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

  wifiConnect.withTimer();              // SNTP接続要求

  // M5 LED Control
  LEDControl led;

  // i2cCtrl
  i2cCtrl _i2cCtrl;
  _i2cCtrl.init();

  // I2C Device Check
  DeviceChk deviceChk;
  deviceChk.i2cScan();

  IMU _imu;
  _imu.whoAmI(deviceChk.imu());

  // I2C OLED Display
  M5OLED m5Oled;
  DisplayData oledData;
  if(deviceChk.m5oled()){
    m5Oled.init();
    m5Oled.clear();
  }

  // 
  datafileCtr dataFile;       // 表示データ管理

  jsData.readJsonFile("/setting.json");

  if(!jsData.filepathIni()){   // DataFile List登録
    uint8_t dataNum;
    if(jsData.dataFilePath.size() > jsData.dataNumber){
      dataNum = jsData.dataNumber;  // データファイルがある場合、前回表示していたデータ番号のファイル読み込む
    }
    else{
      dataNum = 0;  // データファイルがない場合、最初のデータを対象とする
    }
    jsData.readJsonFile(dataFile.jsonFilePath(dataNum));  // データファイルがある場合、最初のデータを読み込む
  }

  // 端子入力初期化
  unsigned char swList[] = {BUTTON_0,BUTTON_1};
  ITM itm(swList,sizeof(swList));

  // 表示モード設定
  modeCtrl dispMode;

  char bufc[100];
  // time_t のバイト数、ビット数
  sprintf( bufc, "sizeof(time_t) : %d bytes (%d bits) \n", sizeof(time_t), sizeof(time_t)*8 );
  Serial.print(bufc);

  while(1){
    static unsigned long ledLasttime = millis(); 
    static unsigned long clockDisptLasttime = millis(); 
    unsigned long timetmp;      // millis()tmp
    uint8_t itmKeyCode;

    timetmp = millis();               // 処理間隔確認用基本時刻

    // 端子入力・表示制御
    itmKeyCode = itm.man();
    if(!jsData.dataFilePath.empty()){
      displayCtrl(itmKeyCode,dataFile); // データファイルがある場合、表示データ制御を行う
    }

    // 表示モード変更
    if(itmKeyCode == 0x01){
      itmKeyCode = 0x00;
      Serial.println("表示モード変更");
      dispMode.modeChange(itmKeyCode);  // 表示モード変更
      Serial.println(dispMode.mode());
    }

    // WiFi Ctrl
    if(itmKeyCode == 0x81){
      itmKeyCode == 0x00;
      Serial.println("WiFi Contrl request.");
      wifiConnect.withItm();    // WiFi端子入力要求
    }

    if(itmKeyCode == 0x82){
      itmKeyCode == 0x00;
      // SD
      sdcard.listDir(SD, "/", 3);

      deviceChk.init();

    }

    wifiConnect.manager();

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
      if(deviceChk.m5oled()){
        m5Oled.printClockData(oledData);
      }
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

    // Matrix Display Control
    if(dispMode.mode() == 0){  // 表示モード0(時計表示
        // 時計データ更新
      if(timetmp - ledLasttime > jsData.clockScrollTime){     // 更新時間確認
        ledLasttime = timetmp;  // 更新時間設定
        std::vector<uint8_t> pageData = displayClock(oledData.timeInfo);
        // データ回転処理
        pageData = jsData.dataRotation(pageData);
        // LEDマトリクスデータ転送
        _i2cCtrl.matrixsetHexdata(pageData);
      }
    }
    else if(dispMode.mode() == 1){  // 表示モード1(マトリクスデータ表示)
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

    // M5OLED表示
    if(deviceChk.m5oled()){
//      m5Oled.printEnvSensorData(oledData);
    }
    // シリアルモニタ処理
    serialMonitor.exec();

    // SD Card Check
    sdcard.cardChk();

    delay(1);
  }

}


// Soundのパラメータ設定
//const int soundPin = 44;
const int soundPin = 2;

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
  while (!Serial);

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


  // sound init PiPo
  setToneChannel(0);
  tone(soundPin, 2000, 100);
  tone(soundPin, 1000, 100);
  tone(soundPin, 500, 100);
  tone(soundPin, 250, 100);
  noTone(soundPin);
}

/**
 * @brief main loop
 * 
 */
void loop() {

  delay(1);
}
