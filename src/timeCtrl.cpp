/**
 * @file timeCtrl.cpp
 * @author hayasita04@gmail.com
 * @brief 時刻制御
 * @version 0.1
 * @date 2024-06-16
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#include "timeCtrl.h"
#include "dotserver.h"

const char* timeZone  = "JST-9";

/**
 * @brief Construct a new Clock Ctrl:: Clock Ctrl object
 * 
 */
ClockCtrl::ClockCtrl(void)
{
  time_t now;
  struct tm timeInfo;
  setenv("TZ", timeZone, 1);
  tzset();  // Assign the local timezone from setenv for mktime()

  time(&now);
  localtime_r(&now, &timeInfo);
  Serial.println(&timeInfo, "%A, %B %d %Y %H:%M:%S");

  return;
}


/**
 * @brief 日時表示データを作成する。
 * 
 * @param buffer 作製した表示データを入れる
 * @param timeinfo 時刻データ
 * @param title 先頭に付けるタイトル文字列
 * @return true 成功
 * @return false 失敗
 */
bool dispDateTime(char* buffer,tm timeinfo,const char* title)
{
  bool ret = true;
  char tmp[50];

  int writtenChars = snprintf(tmp, sizeof(tmp)
    ,"%s%lu/%02d/%02d %02d:%02d:%02d"
    ,title
    ,timeinfo.tm_year+1900,timeinfo.tm_mon+1,timeinfo.tm_mday
    ,timeinfo.tm_hour,timeinfo.tm_min,timeinfo.tm_sec);
  if((writtenChars >= 0 && writtenChars < sizeof(tmp))){
    ret = true;
    strcpy(buffer,tmp);
  }
  else{
    ret = false;
    strcpy(buffer,"Error!!");
  }

  return ret;
}


/**
 * @brief 時刻取得
 * 
 * @return tm 
 */
tm ClockCtrl::getTime(void)
{
  time_t now;
  struct tm timeInfo;
  time(&now);
  localtime_r(&now, &timeInfo);

  return timeInfo;
}

/**
 * @brief SNTP初期化
 * 
 */
void sntpInit(void)
{
//  const char* time_zone  = "JST-9";
  const char* ntp_server = "pool.ntp.org";

  Serial.println("-- SntpCont::init --");
//  Serial.println(confDat.getTimeZoneData());
//  if(confDat.getNtpset() == 1){
  if(true){
    sntp_set_sync_mode ( SNTP_SYNC_MODE_IMMED );    // 同期モード設定　すぐに更新
    sntp_set_sync_interval(1*3600*1000); // 1 hours
//    sntp_set_sync_interval(2*60*1000); // 60Sec

    configTzTime(timeZone, ntp_server);

    // status
    Serial.printf("setup: SNTP sync mode = %d (0:IMMED 1:SMOOTH)\n", sntp_get_sync_mode());
    Serial.printf("setup: SNTP sync status = %d (1:SNTP_SYNC_STATUS_RESET 2:SNTP_SYNC_STATUS_IN_PROGRESS 3:SNTP_SYNC_STATUS_COMPLETED)\n", sntp_get_sync_status());
    Serial.printf("setup: SNTP sync interval = %dms\n", sntp_get_sync_interval());

    // set sntp callback
    sntp_set_time_sync_notification_cb(SntpTimeSyncNotificationCallback);
  }

  sntpCompleted = false;    // SNTP同期完了フラグ初期化

  return;
}
