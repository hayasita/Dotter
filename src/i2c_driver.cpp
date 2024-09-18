
#include <M5Unified.h>
#include <Wire.h>
#include "jsdata.h"
#include "Freenove_VK16K33_Lib.h"
#include "i2c_driver.h"
#include <algorithm>
#include "timeCtrl.h"

#if defined (M5STACK_ATOM)
  #define SDA_PIN 25
  #define SCL_PIN 21
#elif defined (M5STACK_ATOMS3)
  #define SDA_PIN 38
  #define SCL_PIN 39
#elif defined (M5STAMP_S3)
  #define SDA_PIN 13
  #define SCL_PIN 15
#endif

#define I2C_ADDRESS_M5OLED    0x3C    //I2C address for M5 OLED Display SH1107
#define I2C_ADDRESS_SHT30     0x44    //I2C address for SHT30(Unit ENVIII)
#define I2C_ADDRESS_RTC       0x51    //I2C address for RTC
#define I2C_ADDRESS_IMU       0x68    //I2C address for IMU
#define I2C_ADDRESS_QMP6988   0x70    //I2C address for QMP6988(Unit ENVIII)
#define I2C_ADDRESS_VK16K33   0x71    //I2C address for VK16K33

Freenove_VK16K33 matrix = Freenove_VK16K33();

byte arrow3[8] = {
  0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08
};
byte arrow4[8] = {
  0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88
};


i2cCtrl::i2cCtrl()
{

}

void i2cCtrl::init(void)
{
  matrix.init(I2C_ADDRESS_VK16K33,SDA_PIN,SCL_PIN);
  matrix.setBrightness((unsigned char)(jsData.glowInTheBright & 0x0F));
  matrixInit(16, 8);
}

/**
 * @brief i2c Device Scan
 * 
 * @return true デバイスあり
 * @return false デバイスなし
 */
bool i2cCtrl::scan(void)
{
  bool ret = false;
  byte error, address;
  int nDevices;

  nDevices = 0;
  for(address = 1; address < 127; address++ ) 
  {
    // The i2c_scanner uses the return value of
    // the Write.endTransmisstion to see if
    // a device did acknowledge to the address.
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0)
    {
      Serial.print("I2C device found at address 0x");
      if (address<16) 
        Serial.print("0");
      Serial.print(address,HEX);
      Serial.println("  !");

      nDevices++;
      ret = true;
    }
    else if (error==4) 
    {
      Serial.print("Unknown error at address 0x");
      if (address<16) 
        Serial.print("0");
      Serial.println(address,HEX);
    }    
  }

  if(!ret){
    Serial.println("I2C device not found!");
  }

  return ret;
}


void i2cCtrl::test(void)
{
//
  static uint8_t br = 0;

  br++;

  matrix.setBrightness(br & 0x0F);

    arrow3[0]++;
    for (int i = 0; i < 8; i++)
      matrix.setRow(i, arrow4[i] & 0xff);
    for (int i = 8; i < 16; i++)
      matrix.setRow(i, arrow3[i-8] & 0xff);
    matrix.show();

}

void i2cCtrl::matrixInit(uint8_t col,uint8_t row)
{
  _col = col;
  _row = row;
  return;
}

 /**
  * @brief VK16K33 Matrix Driver
  * 
  * @param data 
  */
 void i2cCtrl::matrixset(std::vector<uint8_t> data)
 {
  uint8_t mxData;
  uint8_t num;

  // 輝度設定
  matrix.setBrightness((unsigned char)(jsData.glowInTheBright & 0x0F));

  // 転送データ作成・設定
  for(uint8_t col = 0; col < _col; col++){
    mxData = 0;
    for(uint8_t row = 0; row < _row; row++){
      num = row * _col + col;
      if(data[num] != 0){
        mxData |= (1 << row);
      }
    }
    matrix.setRow(col, mxData & 0xff);
//    Serial.println(mxData,HEX);
  }
  matrix.show();

  return;
 }

void i2cCtrl::matrixsetHexdata(std::vector<uint8_t> data)
{
  // 輝度設定
  matrix.setBrightness((unsigned char)(jsData.glowInTheBright & 0x0F));

  if(data.size() > 0){
    for(uint8_t col = 0; col < _col; col++){
      matrix.setRow(col, data[col] & 0xff);
    }
    matrix.show();
  }

  return;
}

 // M5OLED Control

/**
 * @brief M5OLED初期化
 * @details 表示文字サイズ、表示向き等を設定する。
 */
void M5OLED::init(void)
{
  oled.init(SDA_PIN,SCL_PIN,400000);
//  oled.init();                  // SDA,SCL無しだとNG
  oled.setRotation(1);            // テキストの表示方向を縦方向に設定
  oled.setTextSize(1);
  oled.setCursor(0, 0);           // テキストのカーソル位置を左上に設定。
  oled.startWrite();
  oled.print("hello world!!");
  oled.endWrite();

  return;
}

/**
 * @brief M5OLED画面クリア
 * 
 */
void M5OLED::clear(void)
{
  oled.clear();
  return;
}

/**
 * @brief M5OLED 時計データ表示
 * 
 * @param dispDat 
 */
void M5OLED::printClockData(DisplayData dispDat)
{
  char buffer[100];

  dispDateTime(buffer,dispDat.timeInfo,"");
  oled.setCursor(0, 0);
  oled.print(buffer);
  dispDateTime(buffer,dispDat.lastConnectTime,"");  // 最終接続時刻
  oled.setCursor(0, 8);
  oled.print(buffer);

}

/**
 * @brief M5OLED IMUデータ表示
 * 
 * @param data 
 */
void M5OLED::printIMUData(IMU_RAW_DATA data)
{
  oled.setCursor(0, 16);
  oled.printf("%06d,%06d,%06d", data.ax, data.ay, data.az);
  oled.setCursor(0, 24);
  oled.printf("%06d,%06d,%06d", data.gx, data.gy, data.gz);
  oled.setCursor(0, 32);
  oled.printf("%06d", data.temp);
}

//#ifdef DELETE
/**
 * @brief M5OLEDセンサデータ表示
 * 
 * @param dispDat 表示データ
 */
void M5OLED::printEnvSensorData(DisplayData dispDat)
{
  char buffer[100];

  oled.setCursor(0, 8);
  oled.print("buffer");

/*
  // システム時刻
  dispDateTime(buffer,dispDat.timeInfo,"S:");
  oled.setCursor(0, 0);
  oled.print(buffer);

  //RTC時刻
  dispDateTime(buffer,dispDat.rtcTimeInfo,"R:");
  oled.setCursor(0, 8);
  oled.print(buffer);

  // デバッグ用データ：センサ情報
  DeviceData sensorData;
  sensorData = dispDat.deviceDat;

  oled.setCursor(0, 16);
  dispDeviceData(buffer,sensorData,DEVICE_ENVIII_TEMP);
  oled.printf("%s\n",buffer);  // 気温
  dispDeviceData(buffer,sensorData,DEVICE_ENVIII_HUMI);
  oled.printf("%s\n",buffer);  // 湿度
  dispDeviceData(buffer,sensorData,DEVICE_ENVIII_PRESS);
  oled.printf("%s\n",buffer);  // 気圧
  dispDeviceData(buffer,sensorData,DEVICE_GAS);
  oled.printf("%s\n",buffer);  // ガス
  dispDeviceData(buffer,sensorData,DEVICE_ALTITUBE);
  oled.printf("%s\n",buffer);  // 高度
//  dispDeviceData(buffer,sensorData,DEVICE_ILLUMI);
//  oled.printf("%s\n",buffer);  // 周辺輝度
//  dispDeviceData(buffer,sensorData,DEVICE_DCDC);
//  oled.printf("%s\n",buffer);  // DCDC目標値,DCDCフィードバック値
*/
  return;
}
//#endif

/*
  Device使用可能フラグ作成
*/


void DeviceChk::init(void){
  String status = "";

  detection.datM5OLED = false;
  detection.datSHT30 = false;
  detection.imu = false;
  detection.datQMP6988 = false;
  detection.vk16k33 = false;


  for (int i = 0; i < i2cDevice.size(); i++) {
    if(i2cDevice[i] == I2C_ADDRESS_M5OLED){
      detection.datM5OLED = true;
      status = status + "I2C_ADDRESS_M5OLED : True!\n";
    }
    else if(i2cDevice[i] == I2C_ADDRESS_SHT30){
      detection.datSHT30 = true;
      status = status + "I2C_ADDRESS_SHT30 : True!\n";
    }
    else if(i2cDevice[i] == I2C_ADDRESS_RTC){
      detection.rtc = true;
      status = status + "I2C_ADDRESS_RTC : True!\n";
    }
    else if(i2cDevice[i] == I2C_ADDRESS_IMU){
      detection.imu = true;
      status = status + "I2C_ADDRESS_IMU : True!\n";
    }
    else if(i2cDevice[i] == I2C_ADDRESS_QMP6988){
      detection.datQMP6988 = true;
      status = status + "I2C_ADDRESS_QMP6988 : True!\n";
    }
    else if(i2cDevice[i] == I2C_ADDRESS_VK16K33){
      detection.vk16k33 = true;
      status = status + "I2C_ADDRESS_VK16K33 : True!\n";
    }
  }
  Serial.println(status);

  Serial.println(getBoardName());

  return;
}


String DeviceChk::getBoardName(void)
{
  // run-time branch : hardware model check
  String boardName;
  const char* name;
  switch (M5.getBoard())
  {
#if defined (CONFIG_IDF_TARGET_ESP32S3)
  case m5::board_t::board_M5StampS3:
    name = "StampS3";
    break;
  case m5::board_t::board_M5AtomS3Lite:
    name = "ATOMS3Lite";
    break;
  case m5::board_t::board_M5AtomS3:
    name = "ATOMS3";
    break;
#elif defined (CONFIG_IDF_TARGET_ESP32C3)
  case m5::board_t::board_M5StampC3:
    name = "StampC3";
    break;
  case m5::board_t::board_M5StampC3U:
    name = "StampC3U";
    break;
#elif defined (CONFIG_IDF_TARGET_ESP32)
  case m5::board_t::board_M5Atom:
    name = "ATOM";
    break;
#endif
  default:
    name = "Who am I ?";
    break;
  }
  Serial.print("BoardName:");
  Serial.println(name);

  boardName = name;
//  Serial.println(boardName);

  return boardName;
}

uint8_t DeviceChk::wireChk(uint8_t address){
    uint8_t error;

    error = 1;

    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    return error;
}

bool DeviceChk::m5oled(void){
  return detection.datM5OLED;
}
bool DeviceChk::sht30(void){
  return detection.datSHT30;
}
bool DeviceChk::imu(void){
  return detection.imu;
}
bool DeviceChk::qmp6988(void){
  return detection.datQMP6988;
}
bool DeviceChk::vk16k33(void){
  return detection.vk16k33;
}


void DeviceChk::i2cScan(void){
  byte error, address;
  int nDevices;

  i2cDevice.clear();    // DeviceList 初期化


  Serial.println("Scanning...");
 
  nDevices = 0;
//  address = 0x50;
  for(address = 1; address < 127; address++ )
  {
    // The i2c_scanner uses the return value of
    // the Write.endTransmisstion to see if
    // a device did acknowledge to the address.
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
//    Serial.println(error);

    if (error == 0)
    {
      i2cDevice.push_back(address);   // DeviceList 追加
      nDevices++;
    }
    else if (error==4)
    {
      Serial.print("Unknown error at address 0x");
      if (address<16)
        Serial.print("0");
      Serial.println(address,HEX);
    }
    else{
//      Serial.println(address,HEX);
//      Serial.println(error);
    }
  }
  if (nDevices == 0)
    Serial.println("No I2C devices found\n");
  else
    Serial.println("done\n");

  for (int i = 0; i < i2cDevice.size(); i++) {
    Serial.print("I2C device found at address 0x");
    if (i2cDevice[i]<16)
      Serial.print("0");
    Serial.print(i2cDevice[i],HEX);
    Serial.println("  !");
  }

  init();

  return;
}

