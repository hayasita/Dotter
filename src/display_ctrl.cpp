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
  : currentOperationMode(OperationMode::MODE_DOTTER),     // 動作モード：ドットマトリクス表示
    clockDispMode(ClockDispMode::TWENTY_FOUR_HOUR),       // 時計表示モード：24時間表示
    timerDispMode(TimerDispMode::THREE_MIN)               // タイマー表示モード：タイマー表示 3分
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
 * @brief   現在の動作モード設定
 * 
 * @param mode 
 */
void modeCtrl::setCurrentOperationMode(OperationMode mode)
{
  currentOperationMode = mode;
  return;
}

/**
 * @brief   時計表示モード設定
 * 
 * @param mode 
 */
void modeCtrl::setClockDispMode(ClockDispMode mode)
{
  clockDispMode = mode;
  return;
}

/**
 * @brief   時計表示モード取得
 * 
 * @return ClockDispMode 
 */
ClockDispMode modeCtrl::getClockDispMode(void)
{
  return clockDispMode;
}

/**
 * @brief   タイマー表示モード設定
 * 
 * @param mode 
 */
void modeCtrl::settimerDispMode(TimerDispMode mode)
{
  timerDispMode = mode;
  return;
}

/**
 * @brief   タイマー表示モード取得
 * 
 * @return TimerDispMode 
 */
TimerDispMode modeCtrl::gettimerDispMode(void)
{
  return timerDispMode;
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
      currentOperationMode = OperationMode::MODE_CLOCK;   // ドットマトリクス表示 -> 時計表示
      break;
    case OperationMode::MODE_CLOCK:
      currentOperationMode = OperationMode::MODE_TIMER;   // 時計表示 -> タイマー表示
      break;
    case OperationMode::MODE_TIMER:
      currentOperationMode = OperationMode::MODE_DOTTER;  // タイマー表示 -> ドットマトリクス表示
//      currentOperationMode = OperationMode::MODE_TEST;
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
 * @brief 表示選択
 * 
 * @return true   ドットマトリクス以外の表示選択処理実行
 * @return false  ドットマトリクス表示選択処理要求
 */
bool modeCtrl::displaySelect(void)
{
  bool ret = false;

  if(currentOperationMode == OperationMode::MODE_DOTTER){
    // ドットマトリクス以外の表示選択処理実行
    ret = false;
  }
  else if(currentOperationMode == OperationMode::MODE_CLOCK){
    // 時計表示の表示選択処理実行
    ret = true;
    switch (clockDispMode) {
      case ClockDispMode::TWENTY_FOUR_HOUR:
        clockDispMode = ClockDispMode::TWENTY_FOUR_HOUR_SEC;  // 24時間表示 -> 24時間表示秒あり
        break;
      case ClockDispMode::TWENTY_FOUR_HOUR_SEC:
        clockDispMode = ClockDispMode::TWELVE_HOUR;           // 24時間表示秒あり -> 12時間表示
        break;

      case ClockDispMode::TWELVE_HOUR:
        clockDispMode = ClockDispMode::TWELVE_HOUR_SEC;       // 12時間表示 -> 12時間表示秒あり
        break;
      case ClockDispMode::TWELVE_HOUR_SEC:
        clockDispMode = ClockDispMode::DATE_TIME;             // 12時間表示秒あり -> 日付時刻表示秒あり
        break;

      case ClockDispMode::DATE_TIME:
        clockDispMode = ClockDispMode::DATE;                  // 日付時刻表示秒あり -> 日付表示
        break;
      case ClockDispMode::DATE:
        clockDispMode = ClockDispMode::TWENTY_FOUR_HOUR;      // 日付表示 -> 24時間表示
        break;
      default:
        clockDispMode = ClockDispMode::TWENTY_FOUR_HOUR;      // 24時間表示
        break;
    }
    Serial.print("clockDispMode : ");
    Serial.println(static_cast<uint8_t>(clockDispMode));
  }
  else if(currentOperationMode == OperationMode::MODE_TIMER){
    // タイマー表示の表示選択処理実行
    ret = true;
    switch(timerDispMode){
      case TimerDispMode::THREE_MIN:
        timerDispMode = TimerDispMode::FIVE_MIN;        // タイマー表示 3分 -> タイマー表示 5分
        break;
      case TimerDispMode::FIVE_MIN:
        timerDispMode = TimerDispMode::THREE_FIVE_MIN;  // タイマー表示 5分 -> タイマー表示 3分5分
        break;
      case TimerDispMode::THREE_FIVE_MIN:
        timerDispMode = TimerDispMode::THREE_MIN;       // タイマー表示 3分5分 -> タイマー表示 3分
        break;
      default:
        timerDispMode = TimerDispMode::THREE_MIN;       // タイマー表示 3分
        break;
    }
    _displayTimer->timerSq = TimerSq::TIMER_RESET; // タイマーリセット
  }
  else if(currentOperationMode == OperationMode::MODE_TEST){
    ret = true;
  }
  else{
    ret = false;
  }

  return ret;
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

  switch(dispMode.getCurrentOperationMode())
  {
    case OperationMode::MODE_DOTTER:  // ドットマトリクス表示
      makeTitleDotter(dataNumber);
      break;
    case OperationMode::MODE_CLOCK:   // 時計表示
      makeTitleClock(dispMode.getClockDispMode());
      break;
    case OperationMode::MODE_TIMER:   // タイマー表示
      makeTitleTimer(dispMode.gettimerDispMode());
      break;
    case OperationMode::MODE_TEST:
      makeTitleTest();
      break;
    default:
      break;
  }

  // 最低幅として横16ドットに調整
  titleData.resize(16);

  return;
}

/**
 * @brief ドットマトリクス表示タイトル作成
 * 
 * @param dataNumber 
 */
void displayTitle::makeTitleDotter(uint8_t dataNumber)
{
  char buffer[4];
  buffer[0] = 'D';
  buffer[1] = '0' + dataNumber;
  buffer[2] = ' ';
  buffer[3] = '\0';
  Serial.println(buffer);
  titleData = makeFontData(buffer);

  return;
}
/**
 * @brief 時計タイトル作成
 * 
 * @param clockDispMode 
 */
void displayTitle::makeTitleClock(ClockDispMode clockDispMode)
{
  std::vector<uint8_t> vec;
  switch(clockDispMode)
  {
    case ClockDispMode::TWENTY_FOUR_HOUR:     // 24時間表示
      vec.assign({0x64,	0x52,	0x4C,	0x00,	0x1E,	0x10,	0x7E,	0x00,	0x7E,	0x08,	0x70,	0x00,	0x00,	0x00,	0x00,	0x00});
      break;
    case ClockDispMode::TWENTY_FOUR_HOUR_SEC: // 24時間表示秒あり
      vec.assign({0x64,	0x52,	0x4C,	0x00,	0x1E,	0x10,	0x7E,	0x00,	0x7E,	0x08,	0x70,	0x00,	0x48,	0x54,	0x54,	0x20});
      break;
    case ClockDispMode::TWELVE_HOUR:          // 12時間表示
      vec.assign({0x44,	0x7E,	0x40,	0x00,	0x64,	0x52,	0x4C,	0x00,	0x7E,	0x08,	0x70,	0x00,	0x00,	0x00,	0x00,	0x00});
      break;
    case ClockDispMode::TWELVE_HOUR_SEC:      // 12時間表示秒あり
      vec.assign({0x44,	0x7E,	0x40,	0x00,	0x64,	0x52,	0x4C,	0x00,	0x7E,	0x08,	0x70,	0x00,	0x48,	0x54,	0x54,	0x20});
      break;
    case ClockDispMode::DATE_TIME:            // 日付時刻表示秒あり
      vec.assign({0x7F,	0x09,	0x09,	0x00,	0x3F,	0x40,	0x40,	0x3F,	0x00,	0x7F,	0x40,	0x40,	0x00,	0x7F,	0x40,	0x40});
      break;
    case ClockDispMode::DATE:                 // 日付表示
      vec.assign({0x7F,	0x41,	0x41,	0x22,	0x1C,	0x00,	0x7C,	0x12,	0x11,	0x12,	0x7C,	0x00,	0x07,	0x7C,	0x07,	0x00});
      break;
    default:                                  // 24時間表示
      vec.assign({0x64,	0x52,	0x4C,	0x00,	0x1E,	0x10,	0x7E,	0x00,	0x7E,	0x08,	0x70,	0x00,	0x00,	0x00,	0x00,	0x00});
    break;
  }
  titleData = vec;

  return;
}
/**
 * @brief タイマータイトル作成
 * 
 * @param timerDispMode 
 */
void displayTitle::makeTitleTimer(TimerDispMode timerDispMode)
{
  std::vector<uint8_t> vec;
  switch(timerDispMode)
  {
    case TimerDispMode::THREE_MIN:        // タイマー表示 3分
      vec.assign({0x01,	0x7F,	0x01,	0x00,	0x22,	0x49,	0x49,	0x36,	0x00,	0x70,	0x08,	0x08,	0x70,	0x08,	0x08,	0x70});
      break;
    case TimerDispMode::FIVE_MIN:         // タイマー表示 5分
      vec.assign({0x01,	0x7F,	0x01,	0x00,	0x4F,	0x49,	0x49,	0x31,	0x00,	0x70,	0x08,	0x08,	0x70,	0x08,	0x08,	0x70});
      break;
    case TimerDispMode::THREE_FIVE_MIN:   // タイマー表示 3分5分
      vec.assign({0x01,	0x7F,	0x01,	0x00,	0x22,	0x49,	0x49,	0x36,	0x00,	0x08,	0x08,	0x00,	0x4F,	0x49,	0x49,	0x31});
      break;
    default:                              // タイマー表示 3分
        vec.assign({0x01,	0x7F,	0x01,	0x00,	0x22,	0x49,	0x49,	0x36,	0x00,	0x70,	0x08,	0x08,	0x70,	0x08,	0x08,	0x70});
    break;
  }
  titleData = vec;

  return;
}
/**
 * @brief テストタイトル作成
 * 
 */
void displayTitle::makeTitleTest(void)
{
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
std::vector<uint8_t> dispClock::makeData(tm timeInfo,ClockDispMode mode)
{
  char buffer[100];
  dispDateTime(buffer,timeInfo,"",mode);

  std::vector<uint8_t> data;
  std::vector<uint8_t> dataTmp;
  data.resize(8);     // 冒頭8dot幅は空白

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

/**
 * @brief Construct a new disp Timer::disp Timer object
 * 
 */
dispTimer::dispTimer(void)
  : timerSq(TimerSq::TIMER_RESET),   // タイマー状態s
    isTimerExpired(IsTimerExpired::TIMER_NOT_EXPIRED)                // タイマー経過
{
  return;
}

/**
 * @brief   タイマー時間ドットマトリクス表示データ作成
 * 
 * @return std::vector<uint8_t> 
 */
std::vector<uint8_t> dispTimer::makeDispData(void)    // タイマー時間表示データ作成
{
  std::vector<uint8_t> data;
  std::vector<uint8_t> dataTmp;
  char buffer;

  buffer = '0' + timerTime / 60;
  dataTmp = clockFontData.getFontData(buffer);
  dataTmp.erase(std::remove(dataTmp.begin(), dataTmp.end(), 0x00), dataTmp.end());  // 0x00を削除
  data.insert(data.end(), dataTmp.begin(), dataTmp.end());

  dataTmp = clockFontData.getFontData(':');
  data.insert(data.end(), dataTmp.begin(), dataTmp.end());

  buffer = '0' + (timerTime % 60) / 10;
  dataTmp = clockFontData.getFontData(buffer);
  data.insert(data.end(), dataTmp.begin(), dataTmp.end());

  buffer = '0' + (timerTime % 60) % 10;
  dataTmp = clockFontData.getFontData(buffer);
  data.insert(data.end(), dataTmp.begin(), dataTmp.end());

  // 最低幅として横16ドットに調整
  data.resize(16);

  return data;
}

/**
 * @brief   タイマー表示データ作成
 * 
 * @param mode  タイマー表示モード
 * @return std::vector<uint8_t> 
 */
std::vector<uint8_t> dispTimer::makeData(TimerDispMode mode)    // タイマー表示データ作成
{
  std::vector<uint8_t> data;          // 表示データ
  static unsigned long timer = 0;     // タイマー時間測定
  static unsigned long timerLast;     // タイマー時間測定前回時間

  static unsigned long expiredSqTime; //　タイマー完了表示点滅時間
  static bool expiredDispSq = false;  // タイマー完了表示点滅

  if(timerSq == TimerSq::TIMER_RESET){
    if(mode == TimerDispMode::THREE_MIN){
      timerTime = 180;
//      timerTime = 18;
    }
    else if(mode == TimerDispMode::FIVE_MIN){
      timerTime = 300;
    }
    else if(mode == TimerDispMode::THREE_FIVE_MIN){
      timerTime = 300;
//      timerTime = 30;
    }
    timerSq = TimerSq::TIMER_STOP;
  }
  else if(timerSq == TimerSq::TIMER_STOP){
    timerLast = millis();
    timer = 0;
    isTimerExpired = IsTimerExpired::TIMER_NOT_EXPIRED;
  }
  else if(timerSq == TimerSq::TIMER_RUN){
    // 経過時間測定
    unsigned long timerTmp;
    timerTmp = millis();
    timer += timerTmp - timerLast;
    timerLast = timerTmp;
    if(timer > 1000){
      timer -= 1000;  // 1秒経過
      timerTime--;    // タイマー時間減算
    }
    if( (mode == TimerDispMode::THREE_FIVE_MIN) && (timerTime <= 120) && (isTimerExpired == IsTimerExpired::TIMER_NOT_EXPIRED) ){
      isTimerExpired = IsTimerExpired::TIMER_EXPIRED;
      expiredSqTime = millis();
    }
    if(timerTime == 0){
      isTimerExpired = IsTimerExpired::TIMER_EXPIRED;
      timerSq = TimerSq::TIMER_EXPIRED;
      expiredSqTime = millis();
    }
  }

  data = makeDispData();

  if(isTimerExpired == IsTimerExpired::TIMER_EXPIRED){
    if( (millis() - expiredSqTime) > 500 ){     // タイマー完了表示点滅時間確認
      expiredSqTime = millis();
      expiredDispSq = !expiredDispSq;
    }
    if(expiredDispSq){
//      data.clear();
      data.assign(16, 0xFF);  // 全面点灯
    }
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
