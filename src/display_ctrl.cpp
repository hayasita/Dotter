
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
void displayCtrl(uint8_t keydata,datafileCtr dataFile)
{
  // 表示データ　ファイル読み込み
  if(keydata == 0x02){
    jsData.dataNumber++;
    if(jsData.dataNumber >= dataFile.size()){
      jsData.dataNumber = 0;
    }
    jsData.readJsonFile(dataFile.jsonFilePath(jsData.dataNumber));
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
  std::vector<uint8_t> data = makeFontData(buffer);   // 表示データ作成

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
