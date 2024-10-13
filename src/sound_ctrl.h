#ifndef sound_ctrl_h
#define sound_ctrl_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <cstdint>
#include <M5Unified.h>
//#include "SPIFFS.h"

#define QUEUE_SOUNDLENGTH 4
GLOBAL QueueHandle_t xQueueSoundPlay;           // Sound Play Queue
GLOBAL TaskHandle_t sountaskHandle;             // サウンド処理タスクハンドル
GLOBAL void taskSoundCtrl(void *pvParameters);  // SoundCtrlタスク CPU1

/**
 * @brief   サウンド要求パラメータ
 * 
 */
enum class SoundReqPr{
  SOUND_OFF,    // サウンドOFF
  SOUND_ON,     // サウンドON
  SOUND_STOP,   // サウンド停止
  SOUND_PLAY,   // サウンド再生
  SOUND_PLAY1,  // サウンド再生1
  SOUND_PLAY2,  // サウンド再生2
  SOUND_PLAY3,  // サウンド再生3
};

/**
 * @brief   サウンド制御
 * 
 */
class SoundCtrl{
  public:
    SoundCtrl(void);    // コンストラクタ
    bool soundReqSet(SoundReqPr req);    // サウンド要求設定
};

GLOBAL SoundReqPr soundReq;    // サウンド要求

#undef GLOBAL
#endif