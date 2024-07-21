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

bool dispDateTime(char* buffer,tm timeinfo,const char* title);

#undef GLOBAL
#endif