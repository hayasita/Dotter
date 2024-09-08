
#include <M5Unified.h>
#include "imu.h"
#include <Wire.h>

#define MPU6050_ADDR 0x68
#define MPU6050_WHO_AM_I 0x75

/**
 * @brief IMUのコンストラクタ
 * 
 */
IMU::IMU(void)
{
  return;
}

/**
 * @brief IMUの初期化
 * 
 */
void IMU::init(void)
{
  Serial.println("IMU init");
  Wire.beginTransmission(0x68);//送信処理を開始する(0x68がセンサーのアドレス)
  Wire.write(0x6b);            //レジスタ「0x6b」(動作状変数)を指定
  Wire.write(0x00);            //0x00を指定(ON)
  Wire.endTransmission();      //送信を終了する

  return;
}

/**
 * @brief   IMUのデータ取得
 * 
 * @param data  IMUデータ
 */
void IMU::getRawData(IMU_RAW_DATA *data)
{
  uint8_t i2c_data[14]; //センサからのデータ格納用配列
  int16_t ax = 0;

  Wire.beginTransmission(0x68); //送信処理を開始する
  Wire.write(0x3b);             //(取得値の先頭を指定)
  Wire.endTransmission();       //送信を終了する
  Wire.requestFrom(0x68, 14);   //データを要求する(0x3bから14バイトが6軸の値)

  uint8_t i = 0;
  while (Wire.available()) {
    i2c_data[i] = Wire.read();//データを読み込む
//    Serial.printf("%d:",i);
//    Serial.println(data[i]);
    i++;
  }
  
  data->ax = (i2c_data[0] << 8) | i2c_data[1];
  data->ay = (i2c_data[2] << 8) | i2c_data[3];
  data->az = (i2c_data[4] << 8) | i2c_data[5];
  data->temp = (i2c_data[6] << 8) | i2c_data[7];
  data->gx = (i2c_data[8] << 8) | i2c_data[9];
  data->gy = (i2c_data[10] << 8) | i2c_data[11];
  data->gz = (i2c_data[12] << 8) | i2c_data[13];

  return;
}

/**
 * @brief IMUの移動平均計算
 * 
 * @param data            IMUデータ
 * @return IMU_RAW_DATA   移動平均計算後のデータ
 */
IMU_RAW_DATA IMU::calcIMUMovAvg(IMU_RAW_DATA data) {
    static int32_t axf = 0; // 初期化
    static int32_t ayf = 0; // 初期化
    static int32_t azf = 0; // 初期化

    IMU_RAW_DATA avgData;

    // 移動平均の計算
    axf = (axf - (axf >> 4)) + (int32_t)data.ax;
    ayf = (ayf - (ayf >> 4)) + (int32_t)data.ay;
    azf = (azf - (azf >> 4)) + (int32_t)data.az;

    avgData.ax = (int16_t)(axf >> 4);
    avgData.ay = (int16_t)(ayf >> 4);
    avgData.az = (int16_t)(azf >> 4);

    return avgData;
}

/**
 * @brief IMUの識別情報判定
 * 
 * @param imuChk 
 * @return * void 
 */
void IMU::whoAmI(bool imuChk)
{
  if(imuChk == true){
    Wire.beginTransmission(MPU6050_ADDR);
    Wire.write(MPU6050_WHO_AM_I);
    Wire.endTransmission();
    Wire.requestFrom(MPU6050_ADDR,1);
    uint8_t who = Wire.read();

    Serial.print("IMU:");
    Serial.println(who,HEX);
    if(who == 0x68){
      imuType = IMU_TYPE::MPU6050;
      Serial.println("MPU6050");
    }else if (who == 0x19){
      imuType = IMU_TYPE::MPU6886;
      Serial.println("MPU6886");
    }else{
      imuType = IMU_TYPE::UnknownDevice;
      Serial.println("Unknown device");
    }
  }
  else{
    imuType = IMU_TYPE::NoDevice;
    Serial.println("IMU:Not found");
  }

  return;
}
