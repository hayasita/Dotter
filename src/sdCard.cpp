/**
 * @file sdCard.cpp
 * @author  hayasita04@gmail.com
 * @brief   SDカード制御
 * @version 0.1
 * @date 2024-07-18
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#include "sdCard.h"
#include "device_driver.h"

// SDカードのピン設定
const int SD_SCK_PIN = GPIO_NUM_14;         // SDカードのSCKピン
const int SD_MISO_PIN = GPIO_NUM_39;        // SDカードのMISOピン
const int SD_MOSI_PIN = GPIO_NUM_12;        // SDカードのMOSIピン
const int SD_CS_PIN = GPIO_NUM_11;          // SDカードのCSピン
const int SD_CARDCHK_PIN = 40;              // SDカードの検出ピン

/**
 * @brief Construct a new sd Card::sd Card object
 * 
 */
sdCard::sdCard(void)
{
  isSdMounted = false;  // SDカードのマウント状態初期化
  return;
}

/**
 * @brief SDカードの初期化
 * 
 */
void sdCard::init(void)
{
#ifdef SD_TRUE
  pinMode(SD_CARDCHK_PIN, INPUT_PULLUP);  // SDカードの検出ピンをプルアップ設定

  // SDカードの初期化
  SPI.begin(SD_SCK_PIN, SD_MISO_PIN, SD_MOSI_PIN, SD_CS_PIN);
  if (SD.begin(SD_CS_PIN)) {
    if (SD.cardType() != CARD_NONE) {
      Serial.println("SDカードがマウントされました");
      isSdMounted = true;
    } else {
      Serial.println("SDカードが検出されませんでした");
      isSdMounted = false;
    }
  } else {
    Serial.println("SDカードのマウントに失敗しました");
    isSdMounted = false;
  }

#endif
  return;
}

/**
 * @brief SDカードの状態を確認
 * 
 */
void sdCard::cardChk(void)
{
#ifdef SD_TRUE
  int cardChk;    // SDカードの検出ピンの状態
  cardChk = digitalRead(SD_CARDCHK_PIN);;   // SDカードの検出ピンの状態を取得

  // SDカードの状態を確認
  if ((isSdMounted == true) && (cardChk == HIGH)) {
    SD.end();
    Serial.println("SDカードが取り外されました");
    isSdMounted = false;
  }
  if(isSdMounted == false){
    if(!(cardChk == HIGH)) {
      if (SD.begin(SD_CS_PIN)) {
        Serial.println("SDカードが再度マウントされました");
        isSdMounted = true;
      } else {
        Serial.println("SDカードのマウントに失敗しました");
        isSdMounted = false;
      }
    }
  }

  // ファイル操作の例（SDカードがマウントされている場合のみ）
  if (!(isSdMounted == true)) {
  }

#endif
  return;
}

/**
 * @brief ファイルリスト表示
 * 
 * @param fs        ファイルシステム
 * @param dirname   ディレクトリ名
 * @param levels    レベル
 */
void sdCard::listDir(fs::FS &fs, const char *dirname, uint8_t levels) {
  if(isSdMounted == true){
    Serial.printf("Listing directory: %s\n", dirname);

    uint8_t cardType = SD.cardType();

    if (cardType == CARD_NONE) {
      Serial.println("No SD card attached");
      return;
    }

    Serial.print("SD Card Type: ");
    if (cardType == CARD_MMC) {
      Serial.println("MMC");
    } else if (cardType == CARD_SD) {
      Serial.println("SDSC");
    } else if (cardType == CARD_SDHC) {
      Serial.println("SDHC");
    } else {
      Serial.println("UNKNOWN");
    }

    uint64_t cardSize = SD.cardSize() / (1024 * 1024);
    Serial.printf("SD Card Size: %lluMB\n", cardSize);

    File root = fs.open(dirname);
    if (!root) {
      Serial.println("Failed to open directory");
      return;
    }
    if (!root.isDirectory()) {
      Serial.println("Not a directory");
      return;
    }

    File file = root.openNextFile();
    while (file) {
      if (file.isDirectory()) {
        Serial.print("  DIR : ");
        Serial.println(file.name());
        if (levels) {
          listDir(fs, file.path(), levels - 1);
        }
      } else {
        Serial.print("  FILE: ");
        Serial.print(file.name());
        Serial.print("  SIZE: ");
        Serial.println(file.size());
      }
      file = root.openNextFile();
    }
  }
  else{
    Serial.println("SDカードがマウントされていません");
  }

  return;
}

