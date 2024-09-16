#ifndef jsdata_h
#define jsdata_h

#include "wifi_ctrl.h"

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
 * @brief json内部データ管理
 * 
 */
class jsonData{
  public:
    jsonData(void);   // コンストラクタ
    bool parseJson(String readStr, bool);       // Jsonデータのパース
    void readJsonFile(const char *path);  // JsonファイルからLEDデータ取得
    void saveJsonFile(const char *path);
    std::vector<uint8_t> getPageData(void);  // 任意のページのLEDデータ取得
    std::vector<uint8_t> getPageSaveData(uint8_t page);  // 任意のページのSave用LEDデータ取得
    std::vector<uint8_t> dataRotation(std::vector<uint8_t> data);    // LEDデータ表示方向回転処理
    uint8_t reverseBits(uint8_t num);     // ビット反転処理
    uint8_t size(void);
    uint8_t empty(void);
    void pageCountAdd(void);                  // ページ位置進める
    void paseCountClear(void);                // ページ位置クリア
    uint16_t animationTime;                   // アニメーション間隔
    uint16_t clockScrollTime;                 // 時計スクロール時間

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
    bool showSampleData;          // サンプルデータ表示・非表示設定
    uint8_t dataNumber;           // 表示データ番号
    uint8_t staStartupConnect;    // STA起動時接続設定
    uint8_t staReConnectInterval; // STA再接続間隔

    void wifiPSet(WiFiConnect* pWifiCon);   // WiFi接続設定ポインタ設定
    WiFiConnect *pWifiConnect_  = nullptr;  // WiFi接続制御ポインタ

  private:
    portMUX_TYPE jsonMutex;
    JsonVariant jsonDataArray;
    std::vector<std::vector<uint8_t>> ledAllData; // LEDアニメーションデータ
    std::string filename;

    uint8_t pageCount;            // ページ位置

    String makeJsonPiece(String key, String value ,bool connma);    // jsonデータ作成:String
    String makeJsonPiece(String key, uint8_t value ,bool connma);   // jsonデータ作成:uint8_t

    bool containsSample(const std::string& path);     // ファイル名に "sample" を含むかどうかを判定する関数
    void removeSampleFiles(void);                     // "sample" を含むパスを削除するメンバ関数
};

GLOBAL jsonData jsData;   // jsonデータ

GLOBAL uint8_t getwifiStaListreq;   // WiFiStationList取得要求
GLOBAL uint8_t wifiStaReconnect;    // STA再接続要求

String makeSettingjs(void);         // webIF設定情報 setting.js作製

#undef GLOBAL
#endif