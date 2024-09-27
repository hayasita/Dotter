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
 * @brief モード制御
 * 
 */
class modeCtrl{
  public:
    modeCtrl(void);                  // コンストラクタ
    void modeChange(uint8_t keydata);    // dataFile path
    uint8_t mode(void);
  private:
    uint8_t modeNumber;
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