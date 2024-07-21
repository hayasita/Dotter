/**
 * @file matrix_driver.cpp
 * @author hayasita04@gmail.com
 * @brief Matrix Driver
 * @version 0.1
 * @date 2024-03-25
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#include <M5Unified.h>
#include "matrix_driver.h"

M5ATOMMatrixLED::M5ATOMMatrixLED(void)
{
//  FastLED.addLeds<WS2811, LED_DATA_PIN, GRB>(leds, NUM_LEDS); // initialize RGB LEDs
//  FastLED.setBrightness(10); // set the brightness (more than 20 may break due to heat.)

  return;
}

bool M5ATOMMatrixLED::matrixset(std::vector<uint8_t> ldata)
{
  bool ret;
  uint8_t r,g,b;

  int i,j,num;
  for(i=0;i<M5MATRIX_ROW;i++){
    for(j=0;j<M5MATRIX_COL;j++){
      num = i*MATRIX_COL+j;
      r=0;g=0;b=0;
      if(ldata[num] & 0x01){r = 255;}
      if(ldata[num] & 0x02){g = 255;}
      if(ldata[num] & 0x04){b = 255;}
      leds[i*M5MATRIX_COL+j] = CRGB(r, g, b);
    }
  }
  FastLED.show();

  return ret;
}


MatrixDriverMAX72XX::MatrixDriverMAX72XX(uint8_t col,uint8_t row)
{
  _col = col;
  _row = row;
  mx.begin();
  return;
}

bool MatrixDriverMAX72XX::matrixset(std::vector<uint8_t> data)
{
  uint8_t i,j,num;
  bool ret = true;

  if(data.size() != _col*_row){
    ret = false;
  }
  else{
    mx.control(MD_MAX72XX::UPDATE, MD_MAX72XX::OFF);
    mx.clear();
    for(i=0;i<_row;i++){
      for(j=0;j<_col;j++){
        num = i*_col+(_col-1-j);
        if(data[num] != 0){
          mx.setPoint(i, j, true);
        }
      }
    }
    mx.control(MD_MAX72XX::UPDATE, MD_MAX72XX::ON);
  }

  return ret;
}
