#ifndef imu_h
#define imu_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

enum class IMU_TYPE{
  MPU6050,          // MPU6050
  MPU6886,          // MPU6886
  UnknownDevice,    // デバイス不明
  NoDevice          // デバイス無し
};

class IMU{
  public:
    IMU(void);          // コンストラクタ
    void whoAmI(bool);  // IMUの識別情報作製
    IMU_TYPE imuType;   // IMUの識別情報

};

#undef GLOBAL
#endif
