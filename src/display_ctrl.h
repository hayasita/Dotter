#ifndef display_ctrl_h
#define display_ctrl_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <cstdint>
#include "filesys.h"

void displayCtrl(uint8_t keydata,datafileCtr dataFile);

std::vector<uint8_t> displayClock(tm timeInfo);    // 時計表示

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

#undef GLOBAL
#endif