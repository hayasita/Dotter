

#include "led_ctrl.h"

#if defined (M5STACK_ATOM)
  #define LED_DATA_PIN  27  // LED Data Pin
#elif defined (M5STACK_ATOMS3)
  #define LED_DATA_PIN  35  // LED Data Pin
#elif defined (M5STAMP_S3)
   #define LED_DATA_PIN  21  // LED Data Pin
#elif defined (M5STACK_CORE_ESP32_Tester)
   #define LED_DATA_PIN  3  // Dummy LED Data Pin
#endif

//==========================================
// LED Control
//==========================================

LEDControl::LEDControl(void)
{
  FastLED.addLeds<WS2811, LED_DATA_PIN, GRB>(leds, NUM_LEDS); // initialize RGB LEDs
  FastLED.setBrightness(10);  // set the brightness (more than 20 may break due to heat.)

  for(uint8_t i; i<NUM_LEDS; i++){
    leds_tmp[i] = CRGB::Black;
    leds[i] = CRGB::Black;
    pattern[i] = LEDPATTERN_ALLOFF;
  }
  ledLasttime = millis();
  ledsqf = LED_OFF;

  return;
}


void LEDControl::set(uint8_t lednum, CRGB color, uint8_t ledPattern)
{
  leds_tmp[lednum] = color;
  pattern[lednum] = ledPattern;

  return;
}

void LEDControl::man(void)
{
/*
  for(uint8_t i=0; i<NUM_LEDS; i++){
    leds[i] = leds_tmp[i];
  }
  FastLED.show();
*/

  unsigned long timetemp;

  timetemp = millis();
  if(timetemp - ledLasttime >500){   // 500mSecごとに実行
    ledLasttime = timetemp;
    if(ledsqf == LED_OFF){
      ledsqf = LED_ON;
    }
    else if(ledsqf == LED_ON){
      ledsqf = LED_OFF;
    }
    else{
      ledsqf = LED_OFF;
    }
  }

  for(uint8_t i=0; i<NUM_LEDS; i++){
    if(pattern[i] == LEDPATTERN_ALLON){
      leds[i] = leds_tmp[i];
    }
    else if(pattern[i] == LEDPATTERN_ALLOFF){
      leds[i] = CRGB::Black;
    }
    else if(pattern[i] == LEDPATTERN_ONEBEAT){
      if(ledsqf == LED_ON){
        leds[i] = leds_tmp[i];
      }
      else{
        leds[i] = CRGB::Black;
      }
    }
    else{
    }

  }
  FastLED.show();

  return;
}

