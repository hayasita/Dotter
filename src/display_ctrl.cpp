/**
 * @file display_ctrl.cpp
 * @author hayasita04@gmail.com
 * @brief 表示モード制御・表示データ作成
 * @version 0.1
 * @date 2024-09-29
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#include <M5Unified.h>
#include "display_ctrl.h"
#include "timeCtrl.h"
#include <misakiUTF16.h>
#include "dispFont.h"


/**
 * @brief Construct a new mode Ctrl::mode Ctrl object
 * 
 */
modeCtrl::modeCtrl(void)
  : currentOperationMode(OperationMode::MODE_DOTTER)
{

  return;
}


/**
 * @brief 現在の動作モード取得
 * 
 * @return OperationMode 
 */
OperationMode modeCtrl::getCurrentOperationMode(void)
{
  return currentOperationMode;
}

/**
 * @brief 動作モード切り替え
 * 
 * @param keydata
 */
void modeCtrl::modeChange(uint8_t keydata)
{

  switch (currentOperationMode) {
    case OperationMode::MODE_DOTTER:
      currentOperationMode = OperationMode::MODE_CLOCK;
      break;
    case OperationMode::MODE_CLOCK:
      currentOperationMode = OperationMode::MODE_DOTTER;
//      currentOperationMode = OperationMode::MODE_TIMER;
      break;
    case OperationMode::MODE_TIMER:
      currentOperationMode = OperationMode::MODE_TEST;
      break;
    case OperationMode::MODE_TEST:
      currentOperationMode = OperationMode::MODE_DOTTER;
      break;
    default:
      currentOperationMode = OperationMode::MODE_DOTTER;
      break;
  }

  return;
}

/**
 * @brief Construct a new display Title::display Title object
 * 
 */
displayTitle::displayTitle(void)
  : displayTitleSq(DisplayTitleSq::DISP_TITLE)
{
  return;
}

/**
 * @brief   タイトル表示データ作成
 * 
 * @param dataNumber 
 * @param dispMode 
 */
void displayTitle::makeTitle(uint8_t dataNumber, modeCtrl dispMode)
{
  titleLasttime = millis();
  displayTitleSq = DisplayTitleSq::DISP_TITLE;

  Serial.print("dataNumber : ");
  Serial.println(dataNumber);
  Serial.print("currentOperationMode : ");
  Serial.println(static_cast<uint8_t>(dispMode.getCurrentOperationMode()));
//  Serial.println(titleLasttime);

  char buffer[4];
  buffer[0] = 'D';
  buffer[1] = '0' + dataNumber;
  buffer[2] = ' ';
  buffer[3] = '\0';
  Serial.println(buffer);
//  titleData = clockFontData.getFontData(buffer);
  titleData = makeFontData(buffer);
  // 最低幅として横16ドットに調整
  if(titleData.size() > 16) {
    titleData.resize(16);
  }

  return;
}

/**
 * @brief   タイトル表示データ取得
 * 
 * @return std::vector<uint8_t> 
 */
std::vector<uint8_t> displayTitle::getTitleData(void)
{

  if( (millis() - titleLasttime) > 800 ){     // タイトル表示時間確認
    displayTitleSq = DisplayTitleSq::DISP_DATA;
  }

  return titleData;
}

/**
 * @brief タイトル表示状態取得
 * 
 * @return DisplayTitleSq 
 */
DisplayTitleSq displayTitle::getDisplayTitleSq(void)
{
  return displayTitleSq;
}

/**
 * @brief Construct a new disp Clock::disp Clock object
 * 
 */
dispClock::dispClock() {
  return;
}

/**
 * @brief   時計表示データ作成
 * 
 * @param timeInfo 
 * @return std::vector<uint8_t> 
 */
std::vector<uint8_t> dispClock::makeData(tm timeInfo)
{
  char buffer[100];
//  dispDateTime(buffer,timeInfo,"  ");
  dispDateTime(buffer,timeInfo,"");

  std::vector<uint8_t> data;
  std::vector<uint8_t> dataTmp;
  data.resize(16);

  // 時計表示フォントデータ作成
  size_t length = strlen(buffer); // 文字列の長さを取得
  for (size_t i = 0; i < length; ++i) {
    dataTmp = clockFontData.getFontData(buffer[i]);
    data.insert(data.end(), dataTmp.begin(), dataTmp.end());
  }

  // スクロール処理
  std::vector<uint8_t> newData = data;
  static uint8_t datap = 0;
  if(datap <= data.size()-1) {
    data.erase(data.begin(), data.begin() + datap);
    datap++;
  }
  else{
    datap = 1;
  }
  data.insert(data.end(), newData.begin(), newData.end());

  // 最低幅として横16ドットに調整
  if(data.size() > 16) {
    data.resize(16);
  }

  return data;
}

#ifdef DELETE
/**
 * @brief   時計表示データ作成
 * 
 * @param timeInfo  時刻データ
 * @return std::vector<uint8_t> 表示データ
 */
std::vector<uint8_t> displayClock(tm timeInfo)
{
  char buffer[100];
//  dispDateTime(buffer,oledData.timeInfo,"  ");
  dispDateTime(buffer,timeInfo,"  ");

  // 表示データ作成
//  std::vector<uint8_t> data = makeFontData(buffer);   // 表示データ作成
//  std::vector<uint8_t> data = makeClockFontData(buffer);   // 時計表示データ作成

  clockFont clockFnt;

  clockFnt.init();
  std::vector<uint8_t> data;
  data.resize(16);
  std::vector<uint8_t> dataTmp = clockFnt.getFontData('1');
  data.insert(data.end(), dataTmp.begin(), dataTmp.end());
  dataTmp = clockFnt.getFontData('0');
  data.insert(data.end(), dataTmp.begin(), dataTmp.end());
  // スクロール処理
  std::vector<uint8_t> newData = data;
  static uint8_t datap = 0;
  if(datap <= data.size()-1) {
    data.erase(data.begin(), data.begin() + datap);
    datap++;
  }
  else{
    datap = 1;
  }
  data.insert(data.end(), newData.begin(), newData.end());

  // 最低幅として横16ドットに調整
  if(data.size() > 16) {
    data.resize(16);
  }

  return data;
}
#endif
