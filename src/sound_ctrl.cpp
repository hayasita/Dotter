
#include "device_driver.h"
#include "jsdata.h"
#include "sound_ctrl.h"

/**
 * @brief   サウンド制御タスク
 *          CPU1
 * 
 * @param pvParameters  パラメータ
 */
void taskSoundCtrl(void *pvParameters) {
  uint8_t ret = 0;
  SoundReqPr reqData;    // SoundTaskへのタスク間通信データ
  SoundReqPr req = SoundReqPr::SOUND_STOP;

  unsigned long soundLasttime = millis();
  unsigned long soundTimer;

  setToneChannel(0);
  const int soundPin = SOUND_PIN;

  while (1) {
    ret = xQueueReceive(xQueueSoundPlay, &reqData, 0);
    if(ret){
      Serial.printf("%d = xQueueReceive() : ret = %d\n", reqData, ret);
      req = reqData;
      if(reqData == SoundReqPr::SOUND_PLAY1){
    //    req = SoundReqPr::SOUND_PLAY1;
        soundLasttime = millis() - 1000;    // サウンド再生間隔確認
        soundTimer = millis();              // サウンド再生継続時間
      }
      else if(reqData == SoundReqPr::SOUND_PLAY2){
    //    req = SoundReqPr::SOUND_PLAY2;
        soundLasttime = millis() - 1000;    // サウンド再生間隔確認
        soundTimer = millis();              // サウンド再生継続時間
      }
    }

    if( (millis() - soundTimer) > (1000 * 60) ){    // サウンド再生継続時間確認
      req = SoundReqPr::SOUND_STOP;
    }

    if(req == SoundReqPr::SOUND_PLAY1){
      // sound init PiPo
      if( (millis() - soundLasttime) > 1000 ){      // サウンド再生間隔確認
        soundLasttime = millis();
        if(jsData.soundEnable == 1){
          setToneChannel(0);
          tone(soundPin, 2000, 100);
          tone(soundPin, 0, 10);
          tone(soundPin, 2000, 100);
          tone(soundPin, 0, 10);
          noTone(soundPin);
        }
      }
    }
    else if(req == SoundReqPr::SOUND_PLAY2){
      // sound init PiPo
      if( (millis() - soundLasttime) > 500 ){     // サウンド再生間隔確認
        soundLasttime = millis();
        if(jsData.soundEnable == 1){
          setToneChannel(0);
          tone(soundPin, 2000, 100);
          tone(soundPin, 1000, 100);
          tone(soundPin, 500, 100);
          tone(soundPin, 250, 100);
          noTone(soundPin);
        }
      }
    }
    else{
//      noTone(soundPin);
    }

    delay(1);
  }

}

/**
 * @brief Construct a new Sound Ctrl:: Sound Ctrl object
 * 
 */
SoundCtrl::SoundCtrl(void) {
  return;
}

/**
 * @brief   サウンド要求設定
 * 
 * @param req   サウンド要求
 * @return true   サウンド要求設定成功
 * @return false  サウンド要求設定失敗
 */
bool SoundCtrl::soundReqSet(SoundReqPr req) {
  bool ret = false;
  SoundReqPr reqData;    // SoundTaskへのタスク間通信データ
  if(uxQueueSpacesAvailable(xQueueSoundPlay) != 0){             // キューの追加可能数が0ではない
    reqData = req;
    xQueueSend(xQueueSoundPlay, &reqData, 0);
    ret = true;
  }
  return ret;
}
