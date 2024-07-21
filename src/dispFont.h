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

bool isHalfWidth(uint16_t utf16_code);  // 半角判定

#undef GLOBAL
#endif