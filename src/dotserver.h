#ifndef dotserver_h
#define dotserver_h

#include "wifi_ctrl.h"

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <Arduino.h>
#include <AsyncTCP.h>

#include <ArduinoJson.h>

#include <time.h>
#include <sys/time.h>
#include <sntp.h>

//void startWiFi(void);
void wsCleanupClients(void);
void startWebserver(void);
void setWiFiCallBack(void);     // WiFi接続 Callback設定
void setWebhandle(void);        // Web handle setting

void websocketSend(String sendData);    // WebSocket送信
void wifiScanSta(void);                 // WiFiスキャン

void setWiFihandle(WiFiConnect *);      // WiFi handle setting
void SntpTimeSyncNotificationCallback(struct timeval *tv);    // SNTP同期通知コールバック

String getWifiStaSsid(void);    // STAモードSSID取得
String getWifiStaIpadr(void);   // STAモードIPアドレス取得
String getWifiApSsid(void);     // APモードSSID取得
String getWifiApIpadr(void);    // APモードIPアドレス取得

#undef GLOBAL
#endif
