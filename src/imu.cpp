
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
