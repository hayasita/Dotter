#ifndef imu_h
#define imu_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <cstdint>

/**
 * @brief IMUデバイス種別
 * 
 */
enum class IMU_TYPE{
  MPU6050,          // MPU6050
  MPU6500,          // MPU6500
  MPU6886,          // MPU6886
  UnknownDevice,    // デバイス不明
  NoDevice          // デバイス無し
};

/**
 * @brief IMU RAWデータ
 * 
 */
struct IMU_RAW_DATA{
  int16_t ax;   // 加速度 X軸
  int16_t ay;   // 加速度 Y軸
  int16_t az;   // 加速度 Z軸
  int16_t gx;   // 角速度 X軸
  int16_t gy;   // 角速度 Y軸
  int16_t gz;   // 角速度 Z軸
  int16_t temp; // 温度
};

/**
 * @brief キャリブレーーションデータ
 * 
 */
struct CalibrateData{
  float offsetX;      // X軸オフセット値
  float offsetY;      // Y軸オフセット値
  float offsetZ;      // Z軸オフセット値
  float offsetAngleX; // X軸オフセット角度
  float offsetAngleY; // Y軸オフセット角度
};

/**
 * @brief 相補フィルター計算データ
 * 
 */
struct IMU_FILTER_DATA{
  float gyro_angle_x;   // ジャイロ角度 X軸
  float gyro_angle_y;   // ジャイロ角度 Y軸
  float gyro_angle_z;   // ジャイロ角度 Z軸
  float acc_angle_x;    // 加速度角度 X軸
  float acc_angle_y;    // 加速度角度 Y軸
  unsigned long _interval;  // 時間間隔
};

/**
 * @brief 単位変換後のIMUデータ
 * 
 */
struct IMU_CNV_DATA{
  float acc_x;        // 加速度 X軸
  float acc_y;        // 加速度 Y軸
  float acc_z;        // 加速度 Z軸
  float dpsX;         // 角速度 X軸
  float dpsY;         // 角速度 Y軸
  float dpsZ;         // 角速度 Z軸
  float acc_angle_x;  // 加速度角度 X軸
  float acc_angle_y;  // 加速度角度 Y軸
};

/**
 * @brief IMU制御クラス
 * 
 */
class IMU{
  public:
    IMU(bool ready);        // コンストラクタ

    void init(void);                                // IMU初期化  
    void writeImu(uint8_t reg, uint8_t data);       // IMU I2C書き込み
    uint8_t readImu(uint8_t reg);                   // IMU I2C読み込み

    IMU_TYPE whoAmI(void);                          // IMUの識別情報作製
    void displayWhoAmI(void);                       // IMU whoami表示

    bool getRawData(IMU_RAW_DATA *data);            // IMUデータ取得
    CalibrateData calibrate(void);                  // IMUキャリブレーション
    IMU_FILTER_DATA complementaryFilter(void);      // 相補フィルター

    float getOffsetX(void){return calibrateData.offsetX;}  // X軸オフセット値取得
    float getOffsetY(void){return calibrateData.offsetY;}  // Y軸オフセット値取得
    float getOffsetZ(void){return calibrateData.offsetZ;}  // Z軸オフセット値取得

    void setOffset(CalibrateData offset);            // オフセット値設定

  private:
    bool ready;                             // IMUデバイスの有無
    IMU_TYPE imuType;                       // IMUの識別情報
    uint8_t who;                            // IMU識別情報

    unsigned long preInterval;              // 前回計算した時刻
    float acc_x, acc_y, acc_z;              // 加速度
    float dpsX, dpsY, dpsZ;                 // 角速度
    CalibrateData calibrateData;            // キャリブレーションデータ
    IMU_FILTER_DATA filterData;             // フィルタデータ
    IMU_CNV_DATA convertUnit(IMU_RAW_DATA *data);   // 単位変換

};

#undef GLOBAL
#endif
