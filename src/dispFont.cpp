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

/**
 * @brief Construct a new clock Font::clock Font object
 * 
 */
clockFont::clockFont()
{
  init();
  return;
}

/**
 * @brief   時計フォントデータ初期化
 * 
 */
void clockFont::init(void)
{
  std::vector<uint8_t> dispData;

  dispData.push_back(0x00);
  dispData.push_back(0x00);
  dispData.push_back(0x00);
  dispData.push_back(0x00);
  dispData.push_back(0x00);
  fontArray.push_back({' ',dispData});
  dispData.clear();

// 0
  dispData.push_back(0x00);
  dispData.push_back(0x3E);
  dispData.push_back(0x49);
  dispData.push_back(0x51);
  dispData.push_back(0x3E);
  fontArray.push_back({'0',dispData});
  dispData.clear();

// 1
  dispData.push_back(0x00);
  dispData.push_back(0x42);
  dispData.push_back(0x7F);
  dispData.push_back(0x40);
  fontArray.push_back({'1',dispData});
  dispData.clear();

// 2
  dispData.push_back(0x00);
  dispData.push_back(0x62);
  dispData.push_back(0x51);
  dispData.push_back(0x49);
  dispData.push_back(0x46);
  fontArray.push_back({'2',dispData});
  dispData.clear();

// 3
  dispData.push_back(0x00);
  dispData.push_back(0x22);
  dispData.push_back(0x49);
  dispData.push_back(0x49);
  dispData.push_back(0x36);
  fontArray.push_back({'3',dispData});
  dispData.clear();

// 4
  dispData.push_back(0x00);
  dispData.push_back(0x1F);
  dispData.push_back(0x10);
  dispData.push_back(0x7F);
  dispData.push_back(0x10);
  fontArray.push_back({'4',dispData});
  dispData.clear();

// 5
  dispData.push_back(0x00);
  dispData.push_back(0x2F);
  dispData.push_back(0x49);
  dispData.push_back(0x49);
  dispData.push_back(0x31);
  fontArray.push_back({'5',dispData});
  dispData.clear();

// 6
  dispData.push_back(0x00);
  dispData.push_back(0x3E);
  dispData.push_back(0x49);
  dispData.push_back(0x49);
  dispData.push_back(0x32);
  fontArray.push_back({'6',dispData});
  dispData.clear();

// 7
  dispData.push_back(0x00);
  dispData.push_back(0x01);
  dispData.push_back(0x71);
  dispData.push_back(0x09);
  dispData.push_back(0x07);
  fontArray.push_back({'7',dispData});
  dispData.clear();

// 8
  dispData.push_back(0x00);
  dispData.push_back(0x36);
  dispData.push_back(0x49);
  dispData.push_back(0x49);
  dispData.push_back(0x36);
  fontArray.push_back({'8',dispData});
  dispData.clear();

// 9
  dispData.push_back(0x00);
  dispData.push_back(0x26);
  dispData.push_back(0x49);
  dispData.push_back(0x49);
  dispData.push_back(0x3E);
  fontArray.push_back({'9',dispData});
  dispData.clear();

// /
  dispData.push_back(0x00);
  dispData.push_back(0x60);
  dispData.push_back(0x18);
  dispData.push_back(0x06);
//  dispData.push_back(0x03);
  fontArray.push_back({'/',dispData});
  dispData.clear();


// :
  dispData.push_back(0x00);
  dispData.push_back(0x36);
//  dispData.push_back(0x24);
  fontArray.push_back({':',dispData});
  dispData.clear();

// .
  dispData.push_back(0x00);
  dispData.push_back(0x40);
  fontArray.push_back({':',dispData});
  dispData.clear();


  return;
}

/**
 * @brief   フォントデータ取得
 * 
 * @param str                     フォントデータ取得文字
 * @return std::vector<uint8_t>   フォントデータ
 */
std::vector<uint8_t> clockFont::getFontData(char str)
{

  for(auto it = fontArray.begin(); it != fontArray.end(); ++it){
    if(it->code == str){
      return it->fontData;
    }
  }

  return fontArray[0].fontData;
}
