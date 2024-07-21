#ifndef led_ctrl_h
#define led_ctrl_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <FastLED.h>
#include <cstdint>
#include <vector>

#define LEDPATTERN_ALLOFF   0   // 消灯
#define LEDPATTERN_ALLON    1   // 常時点灯
#define LEDPATTERN_ONEBEAT  2   // 一拍点滅

#define LED_OFF   0       // LED消灯
#define LED_ON    1       // LED点灯

#define NUM_LEDS  1       // LED個数

class LEDControl{
  public:
    LEDControl(void);
    void man(void);
    void set(uint8_t lednum, CRGB color, uint8_t pattern);

  private:
    CRGB leds_tmp[NUM_LEDS];      // 色
    uint8_t pattern[NUM_LEDS];    // 点灯パターン
    CRGB leds[NUM_LEDS];          // 色
    unsigned long ledLasttime;    // LED点滅前回時間(millis)
    uint8_t ledsqf;
};


#undef GLOBAL
#endif
