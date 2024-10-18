
#include <M5Unified.h>
#include "imu.h"
#include <Wire.h>

#define MPU6050_ADDR         0x68   // MPU-6050 device address
#define MPU6050_SMPLRT_DIV   0x19   // MPU-6050 register address
#define MPU6050_CONFIG       0x1a   // 
#define MPU6050_GYRO_CONFIG  0x1b   //
#define MPU6050_ACCEL_CONFIG 0x1c   //
#define MPU6050_WHO_AM_I     0x75   //
#define MPU6050_PWR_MGMT_1   0x6b   //

/**
 * @brief Construct a new IMU::IMU object
 * 
 * @param imuDeviceChk  IMUデバイスの有無
 */
IMU::IMU(bool imuDeviceChk)
{
  ready = imuDeviceChk;
  return;
}

/**
 * @brief IMU I2C書き込み
 * 
 * @param reg レジスタアドレス
 * @param data IMUデータ
 */
void IMU::writeImu(uint8_t reg, uint8_t data)    // IMU I2C書き込み
{
  if(ready == true){
    Wire.beginTransmission(MPU6050_ADDR);
    Wire.write(reg);
    Wire.write(data);
    Wire.endTransmission();
  }
  return;
}


/**
 * @brief IMU I2C読み込み
 * 
 * @param reg レジスタアドレス
 * @return uint8_t データ
 */
uint8_t IMU::readImu(uint8_t reg)
{
  uint8_t data =  0;
  if(ready == true){
    Wire.beginTransmission(MPU6050_ADDR);
    Wire.write(reg);
    Wire.endTransmission(true);
    Wire.requestFrom(MPU6050_ADDR, 1/*length*/); 
    data =  Wire.read();
  }
  return data;
}

/**
 * @brief   IMUキャリブレーション測定
 * 
 * @return CalibrateData キャリブレーションデータ
 */
CalibrateData IMU::calibrate(void)
{

  if(ready == true){
    IMU_RAW_DATA data;
    IMU_CNV_DATA cnvData;
    calibrateData.offsetX = 0, calibrateData.offsetY = 0, calibrateData.offsetZ = 0;

    // キャリブレーション開始
    for(int i = 0; i < 3000; i++){
      getRawData(&data);      //IMUデータ取得
      cnvData = convertUnit(&data);
      calibrateData.offsetX += cnvData.dpsX;
      calibrateData.offsetY += cnvData.dpsY;
      calibrateData.offsetZ += cnvData.dpsZ;
      calibrateData.offsetAngleX += cnvData.acc_angle_x;
      calibrateData.offsetAngleY += cnvData.acc_angle_y;
      if(i % 1000 == 0){
        Serial.print(".");
        M5.Lcd.printf(".");
      }
    }
    Serial.println();
    M5.Lcd.printf("\n");

    calibrateData.offsetX /= 3000;
    calibrateData.offsetY /= 3000;
    calibrateData.offsetZ /= 3000;
    calibrateData.offsetAngleX /= 3000;
    calibrateData.offsetAngleY /= 3000;
    //キャリブレーション終了

    filterData.gyro_angle_x = calibrateData.offsetAngleX;
    filterData.gyro_angle_y = calibrateData.offsetAngleY;
  }
  return calibrateData;
}

/**
 * @brief IMUオフセット情報設定
 * 
 * @param offset オフセット情報
 */
void IMU::setOffset(CalibrateData offset)
{
  if(ready == true){
    calibrateData.offsetX = offset.offsetX;
    calibrateData.offsetY = offset.offsetY;
    calibrateData.offsetZ = offset.offsetZ;
    calibrateData.offsetAngleX = offset.offsetAngleX;
    calibrateData.offsetAngleY = offset.offsetAngleY;

    IMU_RAW_DATA data;
    IMU_CNV_DATA cnvData;
    getRawData(&data);              //IMUデータ取得
    cnvData = convertUnit(&data);   //単位Gへ変換

    filterData.gyro_angle_x = cnvData.acc_angle_x;
    filterData.gyro_angle_y = cnvData.acc_angle_y;
  }
  return;
}
/**
 * @brief IMUの初期化
 * 
 */
void IMU::init(void)
{
  if(ready == true){
    Serial.println("IMU init");
    writeImu(MPU6050_SMPLRT_DIV, 0x00);   // sample rate: 8kHz/(7+1) = 1kHz
    writeImu(MPU6050_CONFIG, 0x00);       // disable DLPF, gyro output rate = 8kHz
    writeImu(MPU6050_GYRO_CONFIG, 0x08);  // gyro range: ±500dps
    writeImu(MPU6050_ACCEL_CONFIG, 0x00); // accel range: ±2g
//    writeImu(MPU6050_PWR_MGMT_1, 0x01);   // disable sleep mode, PLL with X gyro
    writeImu(MPU6050_PWR_MGMT_1, 0x00);   // disable sleep mode, PLL with 8MHz

    filterData.gyro_angle_x = 0;
    filterData.gyro_angle_y = 0;
    filterData.gyro_angle_z = 0;
    filterData.acc_angle_x = 0;
    filterData.acc_angle_y = 0;
    filterData._interval = 0;

    preInterval = (float)millis();
  }
  return;
}

/**
 * @brief IMUの単位変換
 * 
 * @param data 加速度センサ読出しデータ
 * @return IMU_CNV_DATA   単位変換後のデータ
 */
IMU_CNV_DATA IMU::convertUnit(IMU_RAW_DATA *data)
{
  IMU_CNV_DATA cnvData;
  if(ready == true){
#if defined (M5STACK_ATOM)
    cnvData.acc_x = ((float)data->ax) / 16384.0;
    cnvData.acc_y = ((float)data->ay) / 16384.0;
    cnvData.acc_z = ((float)data->az) / 16384.0;

    cnvData.dpsX = ((float)data->gx) / 65.5; // LSB sensitivity: 65.5 LSB/dps @ ±500dps
    cnvData.dpsY = ((float)data->gy) / 65.5;
    cnvData.dpsZ = ((float)data->gz) / 65.5;
    cnvData.acc_angle_x = (atan2(cnvData.acc_y, cnvData.acc_z + abs(cnvData.acc_x)) * 360 / 2.0 / PI);
    cnvData.acc_angle_y = (atan2(cnvData.acc_x, cnvData.acc_z + abs(cnvData.acc_y)) * 360 / -2.0 / PI);
#else
    cnvData.acc_x = -((float)data->ax) / 16384.0;
    cnvData.acc_y = ((float)data->ay) / 16384.0;
    cnvData.acc_z = -((float)data->az) / 16384.0;

    cnvData.dpsX = -((float)data->gx) / 65.5; // LSB sensitivity: 65.5 LSB/dps @ ±500dps
    cnvData.dpsY = ((float)data->gy) / 65.5;
    cnvData.dpsZ = -((float)data->gz) / 65.5;
    cnvData.acc_angle_x = (atan2(cnvData.acc_y, cnvData.acc_z + abs(cnvData.acc_x)) * 360 / 2.0 / PI);
    cnvData.acc_angle_y = (atan2(cnvData.acc_x, cnvData.acc_z + abs(cnvData.acc_y)) * 360 / -2.0 / PI);
#endif
//    cnvData.acc_angle_x = (atan2(cnvData.acc_y, cnvData.acc_z + abs(cnvData.acc_x)) * 360 / 2.0 / PI);
//    cnvData.acc_angle_y = (atan2(cnvData.acc_x, cnvData.acc_z + abs(cnvData.acc_y)) * 360 / -2.0 / PI);
  }
  return cnvData;
}

/**
 * @brief   IMUの相補フィルター計算
 * 
 * @return IMU_FILTER_DATA 
 */
IMU_FILTER_DATA IMU::complementaryFilter(void)
{
  if(ready == true){
    float angleX, angleY, angleZ;
    IMU_RAW_DATA data;
    IMU_CNV_DATA cnvData;

    getRawData(&data);              //IMUデータ取得
    cnvData = convertUnit(&data);   //単位Gへ変換

    //前回計算した時から今までの経過時間を算出
    filterData._interval = (millis() - preInterval);
    preInterval = millis();

    filterData.gyro_angle_x += (cnvData.dpsX - calibrateData.offsetX) * ((float)filterData._interval * 0.001);
    filterData.gyro_angle_y += (cnvData.dpsY - calibrateData.offsetY) * ((float)filterData._interval * 0.001);
    filterData.gyro_angle_z += (cnvData.dpsZ - calibrateData.offsetZ) * ((float)filterData._interval * 0.001);
    filterData.acc_angle_x = cnvData.acc_angle_x;
    filterData.acc_angle_y = cnvData.acc_angle_y;

    angleX = (0.996 * filterData.gyro_angle_x) + (0.004 * cnvData.acc_angle_x);
    angleY = (0.996 * filterData.gyro_angle_y) + (0.004 * cnvData.acc_angle_y);
    angleZ = filterData.gyro_angle_z;
    filterData.gyro_angle_x = angleX;
    filterData.gyro_angle_y = angleY;
    filterData.gyro_angle_z = angleZ;
  }
  return filterData;
}


/**
 * @brief   IMUのデータ取得
 * 
 * @param data  IMUデータ
 * @return bool true:データ取得成功 false:データ取得失敗
 */
bool IMU::getRawData(IMU_RAW_DATA *data)
{
  bool ret = false;
  if(ready == true){
    Wire.beginTransmission(MPU6050_ADDR);
    Wire.write(0x3B);
    Wire.endTransmission(false);
    Wire.requestFrom(MPU6050_ADDR, 14, true);

    data->ax = Wire.read() << 8 | Wire.read();
    data->ay = Wire.read() << 8 | Wire.read();
    data->az = Wire.read() << 8 | Wire.read();
    data->temp = Wire.read() << 8 | Wire.read();
    data->gx = Wire.read() << 8 | Wire.read();
    data->gy = Wire.read() << 8 | Wire.read();
    data->gz = Wire.read() << 8 | Wire.read();

    ret = true;
  }

  return ret;
}

/**
 * @brief IMUの識別情報判定
 * 
 * @return IMU_TYPE
 */
IMU_TYPE IMU::whoAmI(void)
{
  if(ready == true){
    Wire.beginTransmission(MPU6050_ADDR);
    Wire.write(MPU6050_WHO_AM_I);
    Wire.endTransmission();
    Wire.requestFrom(MPU6050_ADDR,1);
    who = Wire.read();

    if(who == 0x68){
      imuType = IMU_TYPE::MPU6050;
    }else if (who == 0x19){
      imuType = IMU_TYPE::MPU6886;
    }else if (who == 0x70){
      imuType = IMU_TYPE::MPU6500;
    }else{
      imuType = IMU_TYPE::UnknownDevice;
    }
  }
  else{
    imuType = IMU_TYPE::NoDevice;
  }
  return imuType;
}

/**
 * @brief   IMUの識別情報表示
 * 
 */
void IMU::displayWhoAmI(void)
{
  if(ready == true){
    whoAmI();

    Serial.print("IMU:");
    Serial.print(who,HEX);

    M5.Lcd.print("IMU:");
    M5.Lcd.print(who,HEX);

    switch(imuType){
      case IMU_TYPE::MPU6050:
        Serial.println(" : MPU6050");
        M5.Lcd.println(" : MPU6050");
        break;
      case IMU_TYPE::MPU6886:
        Serial.println(" : MPU6886");
        M5.Lcd.println(" : MPU6886");
        break;
      case IMU_TYPE::MPU6500:
        Serial.println(" : MPU6500");
        M5.Lcd.println(" : MPU6500");
        break;
      case IMU_TYPE::UnknownDevice:
        Serial.println(" : Unknown device");
        M5.Lcd.println(" : Unknown device");
        break;
      case IMU_TYPE::NoDevice:
        Serial.println(" : IMU:Not found");
        M5.Lcd.println(" : IMU:Not found");
        break;
    }

  }
  return;
}
