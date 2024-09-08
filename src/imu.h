#ifndef imu_h
#define imu_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

/**
 * @brief IMUデバイス種別
 * 
 */
enum class IMU_TYPE{
  MPU6050,          // MPU6050
  MPU6886,          // MPU6886
  UnknownDevice,    // デバイス不明
  NoDevice          // デバイス無し
};

/**
 * @brief IMUデータ
 * 
 */
struct IMU_RAW_DATA{
  int16_t ax;
  int16_t ay;
  int16_t az;
  int16_t gx;
  int16_t gy;
  int16_t gz;
  int16_t temp;
};

/**
 * @brief IMU制御クラス
 * 
 */
class IMU{
  public:
    IMU(void);          // コンストラクタ
    void whoAmI(bool);  // IMUの識別情報作製
    IMU_TYPE imuType;   // IMUの識別情報

    void init(void);                                // IMU初期化  

    void getRawData(IMU_RAW_DATA *data);            // IMUデータ取得
    IMU_RAW_DATA calcIMUMovAvg(IMU_RAW_DATA data);  // IMUデータ移動平均計算
};

#undef GLOBAL
#endif
