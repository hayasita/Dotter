/**
 * @file dispFont.cpp
 * @author hayasita04@gmail.com
 * @brief フォント表示
 * @version 0.1
 * @date 2024-06-17
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#include <M5Unified.h>
#include <cstdint>
#include <misakiUTF16.h>
#include "dispFont.h"

/**
 * @brief 全角・半角判定
 * 入力のUTF-16コードが半角文字（ASCII文字）の範囲内にあるかどうかを判定する。
 * 
 * @param utf16_code 
 * @return true   半角
 * @return false  全角
 */
bool isHalfWidth(uint16_t utf16_code) {
    return utf16_code <= 0x007F;
}

/**
 * @brief 表示用フォントデータ作成
 * 
 * @param buffer 表示文字列
 * @return std::vector<uint8_t> 表示データ
 */
std::vector<uint8_t> makeFontData(char *buffer)  // 
{
  std::vector<uint8_t> data;
    
  uint8_t  fnt[8];
  char *str = buffer;
  char *str2 = buffer;
  uint16_t utf16dat;
  data.clear();
  while(*str) {
  
    uint8_t d1,d2;
    bool baikakuf = true;  // 半角->全角変換フラグ

    byte n = charUFT8toUTF16(&utf16dat, str2 );
    str2+=n;
    if(n != 0){
      if(isHalfWidth(utf16dat)==false){
        // 全角
        d1 = 0;
        d2 = 8;
      }
      else{
        // 半角
        d1 = 4;
        d2 = 4;
      }
    }
    if(baikakuf){
      d1 = 0;
      d2 = 8;
    }

    if (! (str = getFontData(fnt, str, baikakuf)) )  {
      Serial.println("Error"); 
      break;
    }
    else{
      uint8_t rotatedData[8] = {0};
      for(int i = 0; i < 8; ++i) {
        for(int j = d1; j < 8; ++j) {
          if(fnt[i] & (1 << j)) {
            rotatedData[7 - j] |= (1 << i);
          }
        }
      }
      for(int i = 0; i < d2; i++) {
        data.push_back(rotatedData[i]);
      } 
    }

  }

  return data;
}
