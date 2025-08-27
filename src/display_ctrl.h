#ifndef display_ctrl_h
#define display_ctrl_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <cstdint>
#include "filesys.h"
#include "dispFont.h"

class dispTimer;  // タイマー表示

//std::vector<uint8_t> displayClock(tm timeInfo);    // 時計表示

/**
 * @brief 動作モード定義
 * 
 */
enum class OperationMode{
  MODE_DOTTER,    // ドットマトリクス表示
  MODE_CLOCK,     // 時計表示
  MODE_TIMER,     // タイマー表示
  MODE_IMU,       // IMU表示
  MODE_PONGWARS,  // PONG WARS表示
  MODE_TEST,      // テスト表示
  MODE_UNDEFINED  // 不明または無効なデータタイプ
};

/**
 * @brief 時計表示選択
 * 
 */
enum class ClockDispMode{
  TWENTY_FOUR_HOUR,     // 24時間表示
  TWENTY_FOUR_HOUR_SEC, // 24時間表示秒あり
  TWELVE_HOUR,          // 12時間表示
  TWELVE_HOUR_SEC,      // 12時間表示秒あり
  DATE_TIME,            // 日付時刻表示秒あり
  DATE,                 // 日付表示
  OLED_DATE             // OLED表示
};

/**
 * @brief タイマー表示選択
 * 
 */
enum class TimerDispMode{
  THREE_MIN,              // タイマー表示 3分
  FIVE_MIN,               // タイマー表示 5分
  THREE_FIVE_MIN,         // タイマー表示 3分5分
  STOPWATCH               // ストップウォッチ表示
};

/**
 * @brief 動作モード制御
 * 
 */
class modeCtrl{
  public:
    modeCtrl(void);                  // コンストラクタ
    void modeChange(uint8_t keydata);    // dataFile path
    bool displaySelect(void);                     // 表示選択
    OperationMode getCurrentOperationMode(void);  // 現在の動作モード
    void setCurrentOperationMode(OperationMode mode);   // 現在の動作モード設定
    ClockDispMode getClockDispMode(void);         // 時計表示モード
    void setClockDispMode(ClockDispMode mode);    // 時計表示モード設定
    TimerDispMode gettimerDispMode(void);         // タイマー表示モード
    void settimerDispMode(TimerDispMode mode);    // タイマー表示モード設定

    dispTimer *_displayTimer;    // タイマー表示

  private:
    OperationMode currentOperationMode;   // 現在の動作モード
    ClockDispMode clockDispMode;          // 時計表示モード
    TimerDispMode timerDispMode;          // タイマー表示モード

};

/**
 * @brief   タイトル表示制御
 * 
 */
enum class DisplayTitleSq{
  DISP_TITLE,     // タイトル表示
  DISP_DATA       // データ表示
};

class displayTitle{
  public:
    displayTitle(void);                  // コンストラクタ
    void makeTitle(uint8_t dataNumber, modeCtrl dispMode);    // タイトル作成
    std::vector<uint8_t> getTitleData(void);    // タイトルデータ取得
    DisplayTitleSq getDisplayTitleSq(void);     // タイトル表示状態取得
  private:
    std::vector<uint8_t> titleData;   // タイトルデータ
    int extractNumberAfterPrefix(const std::string& str, const std::string& prefix);    // プレフィックス後の数値抽出
    void makeTitleDotter(uint8_t dataNumber);           // ドットマトリクスタイトル作成
    void makeTitleClock(ClockDispMode clockDispMode);   // 時計タイトル作成
    void makeTitleTimer(TimerDispMode timerDispMode);   // タイマータイトル作成
    void makeTitleIMU(void);                            // IMUタイトル作成
    void makeTitlePongWars(void);                       // PONG WARSタイトル作成
    void makeTitleTest(void);                           // テストタイトル作成

    DisplayTitleSq displayTitleSq;    // タイトル表示状態
    unsigned long titleLasttime;      // タイトル表示時間
};

/**
 * @brief   時計表示
 * 
 */
class dispClock{
  public:
    dispClock(void);                  // コンストラクタ
    std::vector<uint8_t> makeData(tm timeInfo,ClockDispMode mode);   // 時計表示データ作成
  private:
    clockFont clockFontData;

};

//bool dispDateTime(char* buffer,tm timeinfo,const char* title,ClockDispMode mode);    // 日時表示データ作成　timeCtrl.cppから移動するべき？

/**
 * @brief   タイマー状態
 * 
 */
enum class TimerSq{
  TIMER_STOP,     // タイマー停止
  TIMER_RUN,      // タイマー動作
  TIMER_PAUSE,    // タイマー一時停止
  TIMER_RESET,    // タイマーリセット
  TIMER_EXPIRED   // タイマー設定時間経過
};

/**
 * @brief タイマー経過状態
 * 
 */
enum class IsTimerExpired{
  TIMER_NOT_EXPIRED,          // タイマー設定時間未経過
  TIMER_EXPIRED,              // タイマー設定時間経過
  TIMER_EXPIRED_CONTINUING    // タイマー設定時間経過後継続動作中
};

/**
 * @brief   タイマー表示
 * 
 */
class dispTimer{
  public:
    dispTimer(void);
    std::vector<uint8_t> makeData(TimerDispMode mode);    // タイマー表示データ作成

    TimerSq timerSq;                // タイマー状態
    IsTimerExpired isTimerExpired;  // タイマー経過

  private:
    uint16_t timerTime;             // タイマー計測時間
    clockFont clockFontData;        // 時計フォントデータ(外部参照にしたほうがよい)

    std::vector<uint8_t> makeDispData(void);  // タイマー時間ドットマトリクス表示データ作成

};


#undef GLOBAL
#endif