#ifndef jsdata_h
#define jsdata_h

#include "wifi_ctrl.h"
#include "display_ctrl.h"
#include "imu.h"

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <ArduinoJson.h>
#include <M5Unified.h>

/**
 * @brief データフォーマット
 * 
 */
enum class DataType{
  rgbData,    // カラーデータ(7色)
  monoData,   // 単色データ
  Undefined   // 不明または無効なデータタイプ
};

/**
 * @brief 動作モード書き込み要求状態
 * 
 */
enum class ModeWriteSQ{
  WAIT,     // 待機
  TIMER,    // タイマー
};

/**
 * @brief json内部データ管理
 * 
 */
class jsonData{
  public:
    jsonData(void);   // コンストラクタ
    bool parseJson(String readStr, bool, bool);       // Jsonデータのパース
    void readJsonFile(const char *path);      // Jsonファイル読み込み
    void saveJsonFile(const char *path);
    bool readLedDataFile(void);               // LED表示データファイル読み込み

    uint8_t getDataNumber(void);              // LED表示データ番号取得
    void ledDisplayCtrl(uint8_t keydata);     // LED表示データ切り替え

    std::vector<uint8_t> getPageData(void);  // 任意のページのLEDデータ取得
    std::vector<uint8_t> getPageSaveData(uint8_t page);  // 任意のページのSave用LEDデータ取得
    std::vector<uint8_t> dataRotation(std::vector<uint8_t> data);    // LEDデータ表示方向回転処理
    uint8_t reverseBits(uint8_t num);     // ビット反転処理
    uint8_t size(void);
    uint8_t empty(void);
    void pageCountAdd(void);                  // ページ位置進める
    void paseCountClear(void);                // ページ位置クリア
    uint16_t animationTime;                   // アニメーション間隔

    std::vector<std::string> dataFilePath;
    void filepathAdd(std::string);
    bool filepathIni(void);
    void writeJsonFile(void);     // setting.json作製・書き込み

    std::string ssid;
    std::string ssidpass;

    // 設定パラメータ
    uint8_t _row;                 // LED行数
    uint8_t _col;                 // LED列数
    DataType dataType;            // データフォーマット

    // setting.json 設定パラメータ
    uint8_t glowInTheBright;      // 表示輝度
    uint8_t rotatePosition;       // 表示方向
    uint8_t dotColor;             // WebIFマトリクスエディタ表示色設定
    uint8_t showSampleData;       // サンプルデータ表示・非表示設定
    uint8_t staStartupConnect;    // STA起動時接続設定
    uint8_t staReConnectInterval; // STA再接続間隔
    uint8_t soundEnable;          // サウンド有効設定
    uint16_t clockScrollTime;     // 時計スクロール時間

    void wifiPSet(WiFiConnect* pWifiCon);   // WiFi接続設定ポインタ設定
    WiFiConnect *pWifiConnect_  = nullptr;  // WiFi接続制御ポインタ

    modeCtrl dispMode;            // 表示モード制御
    displayTitle dispTitle;       // タイトル表示制御

    void modeWriteReq(void);      // モード設定書き込み要求
    void modeWrite(void);         // モード設定書き込み

    void imuCalibrateRq(void);    // IMUキャリブレーション要求
    bool imuCalibrateEx(void);    // IMUキャリブレーション実行
    CalibrateData imuCalibrateData;   // IMUキャリブレーションデータ
  private:
    portMUX_TYPE jsonMutex;
    JsonVariant jsonDataArray;
    std::vector<std::vector<uint8_t>> ledAllData; // LEDアニメーションデータ
    std::string filename;

    uint8_t dataNumber;           // 表示データ番号
    uint8_t pageCount;            // ページ位置

    uint8_t imuCalibrateSq;       // IMUキャリブレーションシーケンス

    ModeWriteSQ modeWriteSq;      // 設定値書き込み要求状態
    unsigned long modeWriteTime;  // 設定値書き込み要求時間

    String makeJsonPiece(String key, String value ,bool connma);    // jsonデータ作成:String
    String makeJsonPiece(String key, uint8_t value ,bool connma);   // jsonデータ作成:uint8_t
    String makeJsonPiece(String key, uint16_t value ,bool connma);  // jsonデータ作成:uint16_t
    String makeJsonPiece(String key, float value ,bool connma);     // jsonデータ作成:float

    bool containsSample(const std::string& path);     // ファイル名に "sample" を含むかどうかを判定する関数
    void removeSampleFiles(void);                     // "sample" を含むパスを削除するメンバ関数
};

GLOBAL jsonData jsData;   // jsonデータ

GLOBAL uint8_t getwifiStaListreq;   // WiFiStationList取得要求
GLOBAL uint8_t wifiStaReconnect;    // STA再接続要求

String makeSettingjs(void);         // webIF設定情報 setting.js作製

#undef GLOBAL
#endif