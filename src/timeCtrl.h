/**
 * @file timeCtrl.h
 * @author hayasita04@gmail.com
 * @brief 時刻制御
 * @version 0.1
 * @date 2024-06-16
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#ifndef timeCtrl_h
#define timeCtrl_h

#include "display_ctrl.h"

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

//#include <M5Unified.h>
#include <time.h>
#include <sys/time.h>
#include <sntp.h>

/**
 * @brief 時計制御クラス
 * 
 */
class ClockCtrl{
  public:
    ClockCtrl(void);
    tm getTime(void);
};

bool dispDateTime(char* buffer,tm timeinfo,const char* title,ClockDispMode mode);    // 日時表示データ作成 display_ctrl.cppにもっていくべき？

void sntpInit(void);    // SNTP初期化

#undef GLOBAL
#endif