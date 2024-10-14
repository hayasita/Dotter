/**
 * @file dotserver.cpp
 * @author hayasita04@gmail.com
 * @brief Webサーバ基本操作
 * @version 0.1
 * @date 2024-03-10
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#include <SPIFFS.h>
#include <WiFi.h>
#include "ESPAsyncWebServer.h"
#include "dotserver.h"
#include "jsdata.h"

#include "wifi_ctrl.h"

#include "Update.h"
#include "ota.h"

void handleNotFound(AsyncWebServerRequest *request);  // ハンドル設定無し・要求ファイル取得
void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);

#define HTTP_PORT 80
AsyncWebServer server(HTTP_PORT);
AsyncWebSocket ws("/ws");

// WiFiアクセスポイントの設定
//const char* ssid = "Dotter1";
//const char* password = "";

/**
 * @brief WiFi接続開始
 * 
 */
/*
void startWiFi(void)
{
//#ifdef DELETE
  WiFi.mode(WIFI_MODE_STA);
  WiFi.begin();
  Serial.print("WiFi connecting");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println(" connected");
//#endif
#ifdef DELETE
  // WiFiを初期化し、アクセスポイントモードに設定
  WiFi.softAP(ssid, password);

  Serial.println("Access Point started");
  IPAddress apIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(apIP);
#endif

  Serial.print("HTTP Server: http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");

  return;
}
*/

void wsCleanupClients(void)
{
  // WebSocketのクライアントをクリーンアップ
  ws.cleanupClients();
}

void websocketSend(String sendData)
{
  Serial.println("websocketSend");
  Serial.println(sendData);
  ws.textAll(sendData.c_str());

  return;
}

/**
 * @brief webサーバ初期化
 * 
 */
void startWebserver(void)
{
  server.begin();
  Serial.println("HTTP server started");

  return;
}

/**
 * @brief Set the Webhandle object
 * 
 */
void setWebhandle(void)
{

  // WebSocketイベントのハンドラを設定
  ws.onEvent(onWebSocketEvent);

  // WebSocketエンドポイントを登録
  server.addHandler(&ws);

  // アクセスされた際に行う関数を登録する
  server.on("/setting.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "application/javascript", makeSettingjs());
  });

  //Returns update page
  server.on("/update.html", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/html", updateHtml);
  });

  // ファームウェアアップデートのエンドポイント設定
  server.on("/update", HTTP_POST, [](AsyncWebServerRequest *request) {
    // アップデート完了時のレスポンスを設定
    request->send(200, "text/plain", Update.hasError() ? "FAIL" : "OK");
    ESP.restart(); // アップデート後にESP32を再起動
  }, [](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final) {
    // アップロードの開始処理
    if (index == 0) {
      Serial.printf("Update Start: %s\n", filename.c_str());

      // ファームウェアのアップデートかSPIFFSのアップデートかを判定
      if (filename.endsWith(".bin")) {
        if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
          Update.printError(Serial);
        }
      } else if (filename.endsWith(".spiffs")) {
        if (!Update.begin(UPDATE_SIZE_UNKNOWN, U_SPIFFS)) { //SPIFFSのアップデート
          Update.printError(Serial);
        }
      } else {
        Serial.println("Unknown file type");
        request->send(400, "text/plain", "Unknown file type");
        return;
      }
    }

    // ファームウェアの書き込み処理
    if (len) {
      if (Update.write(data, len) != len) {
        Update.printError(Serial);
      }
    }

    // アップロード完了処理
    if (final) {
      if (Update.end(true)) { // 成功した場合
        Serial.printf("Update Success: %u\nRebooting...\n", index + len);
      } else {
        Update.printError(Serial);
      }
    }
  });

  // 未登録ハンドル処理
  server.onNotFound(handleNotFound);

  return;
}

/**
 * @brief Get the Content Type object
 * MIMEタイプを推定
 * 
 * @param filename 
 * @return String 
 */
String getContentType(String filename)
{
  if(filename.endsWith(".html") || filename.endsWith(".htm")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".png")) return "image/png";
  else if(filename.endsWith(".gif")) return "image/gif";
  else if(filename.endsWith(".jpg")) return "image/jpeg";
  else return "text/plain";
}

/**
 * @brief 要求されたSPIFSS のファイルをクライアントに転送する
 * 
 * @param request 
 */
void handleNotFound(AsyncWebServerRequest *request)
{
  String path = request->url();
  Serial.println(">> handleFileRead: trying to read " + path);
  // パス指定されたファイルがあればクライアントに送信する
  if (path.endsWith("/")) path += "index.html";
  String contentType = getContentType(path);
  Serial.println("contentType: " + contentType);
  if (SPIFFS.exists(path)) {
    Serial.println("handleFileRead: sending " + path);
    File file = SPIFFS.open(path, "r");
    request->send(SPIFFS, path, String(), false);
    return;
  }
  else {
    Serial.println("handleFileRead: 404 not found");
    request->send(404);
    return;
  }
}

/**
 * @brief WebSocketイベントのハンドラ
 * 
 * @param server 
 * @param client 
 * @param type 
 * @param arg 
 * @param data 
 * @param len 
 */
void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
  static String receivedData = "";    // 受信データ
  switch(type) {
    case WS_EVT_CONNECT:
      Serial.println("WebSocket client connected");
      receivedData = "";
      break;
    case WS_EVT_DISCONNECT:{
      Serial.println("WebSocket client disconnected");
    }
      break;
    case WS_EVT_DATA:{
      AwsFrameInfo *info = (AwsFrameInfo*)arg;
      receivedData += String((char*)data, len);
      if (info->final) {  // 最後のフレームであれば処理する
//        Serial.println(receivedData);
        if( jsData.parseJson(receivedData,true,true) ){
          receivedData = "";  // JSONのパースに成功した場合データリセット。失敗した場合データを繋げて再度パース試みる。データの総量に注意。
        }
      }
//      Serial.println(receivedData);
    }
      break;
    
    default:
      break;
  }
}

/**
 * @brief WiFi STAモードの接続先検索
 * WiFiネットワークのスキャンを行う
 * 
 */
void wifiScanSta(void)
{
  static uint8_t getwifiListsqf = 0;      // WiFiリスト取得シーケンスフラグ

  if(getwifiStaListreq == 1){             // WiFiリスト取得要求
    int16_t ssidNum;                      // WiFiリスト取得数
    if(getwifiListsqf == 0){    
//        vfdevent.setEventlogLoop(EVENT_WiFi_SSIDSCAN_START);
      getwifiListsqf = 1;                 // WiFiリスト取得シーケンスフラグ：スキャン開始
    }
    else if(getwifiListsqf == 1){         // WiFiリスト取得シーケンスフラグ：スキャン開始
      Serial.println("scan done\r\n");
      ssidNum = WiFi.scanNetworks(true);  // WiFiスキャン開始
      getwifiListsqf = 2;                 // WiFiリスト取得シーケンスフラグ：スキャン結果取得
    }
    else if(getwifiListsqf == 2){         // WiFiリスト取得シーケンスフラグ：スキャン結果取得
      ssidNum = WiFi.scanComplete();      // WiFiスキャン完了確認
      if(ssidNum == WIFI_SCAN_RUNNING){   // WiFiスキャン中
        Serial.println("WIFI_SCAN_RUNNING\n");
      }
//    else if(ssidNum == WiFi_SCAN_FAILED){
          // 失敗
//    }
      else{                                // WiFiスキャン完了  
//          vfdevent.setEventlogLoop(EVENT_WiFi_SSIDSCAN_COMP);     // WiFi SSID 検索完了
        #define SSIDLIMIT 30              // SSIDリスト取得数制限 最大30
        String ssid_rssi_str[SSIDLIMIT];
        String ssid_str[SSIDLIMIT];
//        String str = "\"stationList\":[\n";
        String str = "{\"stationList\":[\n";
        if (ssidNum == 0) {
          Serial.println("no networks found");
        } else {
          Serial.printf("%d networks found\r\n\r\n", ssidNum);
          if (ssidNum > SSIDLIMIT) ssidNum = SSIDLIMIT;   // SSIDリスト取得数制限
          for (int i = 0; i < ssidNum; ++i) {             // WiFiリスト取得Loop
            ssid_str[i] = WiFi.SSID(i);
            String wifi_auth_open = ((WiFi.encryptionType(i) == WIFI_AUTH_OPEN)?" ":"*");
            ssid_rssi_str[i] = ssid_str[i] + " (" + WiFi.RSSI(i) + "dBm)" + wifi_auth_open;
            if(i != 0){   // 2件目以降はカンマを付加
              str = str + ",\n";
            }
            str = str + "{\"ID\":\"" + ssid_str[i] + "\",\"TITLE\":\"" + ssid_rssi_str[i] + "\"}";
            Serial.printf("%d: %s\r\n", i, ssid_rssi_str[i].c_str());
          }
//          str = str + "\n]";
          str = str + "\n]}";
//            websocketDataSend.wifiStaList = str;
//            websocketDataSend.wifiStaListSend = ON;
          Serial.println(str);
          websocketSend(str);
          getwifiStaListreq = 0;
        }
      }
    }
  }
  else{
    getwifiListsqf = 0;
  }

  return;
}

// ----- Call Back -----

/**
 * @brief Set the Wi Fihandle object
 * 
 * @param _WiFiConnect 
 */
void setWiFihandle(WiFiConnect *_WiFiConnect)
{
  WiFi.onEvent([_WiFiConnect](WiFiEvent_t event, WiFiEventInfo_t info) {
    switch (event) {
      case ARDUINO_EVENT_WIFI_READY:                // ESP32のWiFiが準備完了した。
        Serial.println("== CallBack ESP32のWiFiが準備完了した。");
        break;
      case ARDUINO_EVENT_WIFI_SCAN_DONE:            // WiFiのスキャンが完了した。
        Serial.println("== CallBack WiFiのスキャンが完了した。");
        break;
      case ARDUINO_EVENT_WIFI_STA_START:            // ステーションモードが開始された。
        Serial.println("== CallBack ステーションモードが開始された。");
        break;
      case ARDUINO_EVENT_WIFI_STA_STOP:             // ステーションモードが停止された。
        Serial.println("== CallBack ステーションモードが停止された。");
        break;
      case ARDUINO_EVENT_WIFI_STA_CONNECTED:        // ステーションがAPに接続した。
        Serial.println("== CallBack ステーションがAPに接続した。");
        break;
      case ARDUINO_EVENT_WIFI_STA_DISCONNECTED:     // ステーションがAPから切断された。
        Serial.println("== CallBack ステーションがAPから切断された。");
        break;
      case ARDUINO_EVENT_WIFI_STA_AUTHMODE_CHANGE:  // 接続中のAPの認証モードが変更された。
        Serial.println("== CallBack 接続中のAPの認証モードが変更された。");
        break;
      case ARDUINO_EVENT_WIFI_STA_GOT_IP:           // ステーションがIPアドレスを取得した。
        Serial.println("== CallBack ステーションがIPアドレスを取得した。");
        break;
      case ARDUINO_EVENT_WIFI_STA_LOST_IP:          // ステーションがIPアドレスを失った。
        Serial.println("== CallBack ステーションがIPアドレスを失った。");
        break;

      case ARDUINO_EVENT_WIFI_AP_START:             // アクセスポイントモードが開始された。
        Serial.println("== CallBack アクセスポイントモードが開始された。");
        break;
      case ARDUINO_EVENT_WIFI_AP_STOP:              // アクセスポイントモードが停止された。
        Serial.println("== CallBack アクセスポイントモードが停止された。");
        _WiFiConnect->apStopCollBack();
        break;
      case ARDUINO_EVENT_WIFI_AP_STACONNECTED:      // クライアントがアクセスポイントに接続した。
        Serial.println("== CallBack クライアントがアクセスポイントに接続した。");
        break;
      case ARDUINO_EVENT_WIFI_AP_STADISCONNECTED:   // クライアントがアクセスポイントから切断された。
        Serial.println("== CallBack クライアントがアクセスポイントから切断された。");
        break;
      case ARDUINO_EVENT_WIFI_AP_STAIPASSIGNED:     // アクセスポイントに接続しているクライアントにIPアドレスが割り当てられた。
        Serial.println("== アクセスポイントに接続しているクライアントにIPアドレスが割り当てられた。");
        break;

      default:
        break;
    }
  });

  return;
}

/**
 * @brief SNTPの同期が完了したときに呼び出されるコールバック関数
 * 同期が完了していたら、SNTP同期完了フラグをtrueに設定する。
 * 
 * @param tv 
 */
void SntpTimeSyncNotificationCallback(struct timeval *tv)
{
  sntp_sync_status_t sntp_sync_status = sntp_get_sync_status();
  Serial.println("== SntpTimeSyncNotificationCallback ==");
  Serial.print("sntp_sync_status:");
  Serial.println(sntp_sync_status);

  if (sntp_sync_status == SNTP_SYNC_STATUS_COMPLETED)
  {
    Serial.println("-- SNTP_SYNC_STATUS_COMPLETED --");
    
    sntpCompleted = true;           // SNTP同期完了フラグ設定
  }
  else{
    Serial.println("callback else");
  }
  return;
}

// STAモードSSID取得
String getWifiStaSsid(void){
  return(WiFi.SSID());
}
// STAモードIPアドレス取得
String getWifiStaIpadr(void){
  return((WiFi.localIP()).toString());
}
// APモードSSID取得
String getWifiApSsid(void){
  return(WiFi.softAPSSID());
}
// APモードIPアドレス取得
String getWifiApIpadr(void){
  return((WiFi.softAPIP()).toString());
}
