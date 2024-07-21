/**
 * @file sdCard.h
 * @author  hayasita04@gmail.com
 * @brief   SDカード制御
 * @version 0.1
 * @date 2024-07-18
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#ifndef sdCard_h
#define sdCard_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include "FS.h"
#include "SD.h"
#include "SPI.h"

#include "M5UnitOLED.h"

/**
 * @brief SDカード制御
 * 
 */
class sdCard
{
  public:
    sdCard(void);           // コンストラクタ
    void init(void);        // 初期化
    void cardChk(void);     // SDカードの状態を確認
    void listDir(fs::FS &fs, const char * dirname, uint8_t levels); // ファイルリスト表示

  private:
    bool isSdMounted;       // SDカードのマウント状態
};

GLOBAL sdCard sdcard;       // SDカードクラス

#undef GLOBAL
#endif