
#include "jsdata.h"
#include "display_ctrl.h"
#include "timeCtrl.h"
#include <misakiUTF16.h>
#include "dispFont.h"

/**
 * @brief 表示制御
 * ドットマトリクスに表示するデータの切り替えを行う
 * 
 * @param keydata   キー入力データ
 * @param dataFile  表示データ管理
 */
void displayCtrl(uint8_t keydata)
{
  // 表示データ　ファイル読み込み
  if(keydata == 0x02){
    jsData.dataNumber++;
    if(jsData.dataNumber >= jsData.dataFilePath.size()){
      jsData.dataNumber = 0;
    }
    jsData.readLedDataFile();
    jsData.writeJsonFile();    // dataNumber更新（設定値書き込み
  }

  return;
}

/**
 * @brief Construct a new mode Ctrl::mode Ctrl object
 * 
 */
modeCtrl::modeCtrl(void)
{
  modeNumber = 1;
  return;
}

/**
 * @brief  モード番号取得
 * 
 * @return uint8_t 
 */
uint8_t modeCtrl::mode(void)
{
  return modeNumber;
}

/**
 * @brief  モード切り替え
 * 
 * @param keydata 
 */
void modeCtrl::modeChange(uint8_t keydata)
{
  modeNumber++;
  if(modeNumber >= 2){
    modeNumber = 0;
  }
  return;
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
