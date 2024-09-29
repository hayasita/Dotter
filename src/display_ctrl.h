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

//std::vector<uint8_t> displayClock(tm timeInfo);    // 時計表示

/**
 * @brief 動作モード定義
 * 
 */
enum class OperationMode{
  MODE_DOTTER,    // ドットマトリクス表示
  MODE_CLOCK,     // 時計表示
  MODE_TIMER,     // タイマー表示
  MODE_TEST,      // テスト表示
  MODE_UNDEFINED  // 不明または無効なデータタイプ
};

/**
 * @brief 動作モード制御
 * 
 */
class modeCtrl{
  public:
    modeCtrl(void);                  // コンストラクタ
    void modeChange(uint8_t keydata);    // dataFile path
    OperationMode getCurrentOperationMode(void);   // 現在の動作モード

  private:
    OperationMode currentOperationMode;   // 現在の動作モード
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
    std::vector<uint8_t> makeData(tm timeInfo);   // 時計表示データ作成
  private:
    clockFont clockFontData;

};

#undef GLOBAL
#endif