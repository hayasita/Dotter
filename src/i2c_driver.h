#ifndef i2c_driver_h
#define i2c_driver_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <M5UnitOLED.h>
#include <cstdint>
#include <vector>

/*
#include "Freenove_VK16K33_Lib.h"
#include <Wire.h>
#define SDA_PIN 25
#define SCL_PIN 21
*/

// --Device検出情報
class I2CDeviceDetection{
  public:
    bool datM5OLED;       // M5 OLED Unit
    bool datSHT30;        // SHT30(Unit ENVIII)
    bool imu;             // IMU
    bool datQMP6988;      // QMP6988(Unit ENVIII)
    bool vk16k33;         // VK16K33
};
// -- Device有無確認
class DeviceChk{
  public:
    void init(void);
    bool m5oled(void);
    bool sht30(void);
    bool imu(void);
    bool qmp6988(void);
    bool vk16k33(void);

    void i2cScan();
    std::vector<uint8_t> i2cDevice;
    I2CDeviceDetection detection;   // i2cDevice 検出情報

  private:
    uint8_t wireChk(uint8_t address);
    String getBoardName(void);

};

/**
 * @brief I2C制御
 * 
 */
class i2cCtrl{
  public:
    i2cCtrl();      // コンストラクタ
    void init(void);
    bool scan(void);

    void test(void);
    void matrixInit(uint8_t col,uint8_t row);
    void matrixset(std::vector<uint8_t> data);
    void matrixsetHexdata(std::vector<uint8_t> data);

  private:
    uint8_t _col;
    uint8_t _row;

};

//#ifdef DELETE
// -- デバッグ用表示情報
class DisplayData{
  public:
    struct tm timeInfo;
//    struct tm rtcTimeInfo;
//    DeviceData deviceDat;
};

/**
 * @brief M5OLED操作クラス
 * @details 
 * 
 */
class M5OLED{
  public:
//    M5OLED(void);
    void init(void);
    void clear(void);
    void printClockData(DisplayData);
    void printEnvSensorData(DisplayData);
  private:
    M5UnitOLED oled;

};
//#endif

#undef GLOBAL
#endif