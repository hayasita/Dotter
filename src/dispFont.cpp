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
#include <cstdint>


bool isHalfWidth(uint16_t utf16_code) {
    return utf16_code <= 0x007F;
}

