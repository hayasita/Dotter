/**
 * @file dispFont.h
 * @author hayasita04@gmail.com
 * @brief フォント表示
 * @version 0.1
 * @date 2024-06-17
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#ifndef dispFont_h
#define dispFont_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <cstdint>
#include <vector>

bool isHalfWidth(uint16_t utf16_code);  // 半角判定

std::vector<uint8_t> makeFontData(char *str);  // フォントデータ作成

/**
 * @brief   時計フォントデータ
 * 
 */
class clockFontTbl{
  public:
    uint8_t code;                       // コード
    std::vector<uint8_t> fontData;      // フォントデータ
};

/**
 * @brief   時計フォント処理
 * 
 */
class clockFont{
  public:
    clockFont();
    void init(void);                              //  時計フォントデータ初期化
    std::vector<uint8_t> getFontData(char str);   // フォントデータ取得
  private:
    std::vector<clockFontTbl> fontArray;           // フォントデータ
};

#undef GLOBAL
#endif