/**
 * @file monitor.cpp
 * @author hayasita04@gmail.com
 * @brief シリアルモニタ処理
 * @version 0.1
 * @date 2024-02-28
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#include <iostream>
#include <algorithm>
#include "monitor.h"

#include "SPIFFS.h"
#include <FS.h>
#include <esp_task_wdt.h>
#include "jsdata.h"

/**
 * @brief Destroy the Serial Monitor I O:: Serial Monitor I O object
 * 
 */
MonitorDeviseIo::~MonitorDeviseIo() {}

/**
 * @brief Construct a new Serial Monitor:: Serial Monitor object
 * 
 * @param pMonitorDeviseIo 
 */
SerialMonitor::SerialMonitor(MonitorDeviseIo* pMonitorDeviseIo){
  monitorIo_ = pMonitorDeviseIo;
  init();
}

void SerialMonitor::init(void)
{
//  std::cout << "SerialMonitor::init";

  codeArray.push_back({"help"       ,[&](){return opecodeHelp(command);}    ,"Help\tDisplays help information for the command."});
  codeArray.push_back({"ls"         ,[&](){return opecodels(command);}  ,"ls path"});
  codeArray.push_back({"datalist"   ,[&](){return opecodedatalist(command);}  ,"datalist\tDisplays Matrix data file list."});
  codeArray.push_back({"env"        ,[&](){return opecodeenv(command);}  ,"env\tconfig data list."});
  codeArray.push_back({"command2"   ,[&](){return dummyExec(command);}  ,"command Help."});
  return;
}

/**
 * @brief シリアルモニタ実行
 * 
 * @return true コマンド実行成功
 * @return false コマンド実行失敗
 */
bool SerialMonitor::exec(void)
{
  std::string commandBuf;
//  std::vector<std::string> command;     // シリアルモニタコマンド
  bool ret = true;

  commandBuf = monitorIo_->rsv();

  if(commandBuf.size() > 0){
    commandBuf.erase(std::remove(commandBuf.begin(), commandBuf.end(), '\r'), commandBuf.end());    // CRを取り除く
    commandBuf.erase(std::remove(commandBuf.begin(), commandBuf.end(), '\n'), commandBuf.end());    // LFを取り除く
  }
  if(commandBuf.size() > 0){
    command = spritCommand(commandBuf);   // コマンドをトークンごとに分割
/*      
    for (const auto &str : command) {
      std::cout << str << std::endl;
    }
*/
    std::vector<codeTbl>::iterator itr = std::find_if(codeArray.begin(),codeArray.end(),[&](codeTbl &c) {   // コマンド実行テーブル検索
      return(c.code == command[0]);
    });
    if(itr != codeArray.end()){
/*
      std::cout << "テーブル検索成功\n";
      std::cout << (*itr).code << ":" << command[0] << ":\n";
      for (char c : command[0]) {
      // 1文字ごとのASCIIコードを出力
        std::cout << (int)c << "\n";
      }
*/
      ret = (*itr).execCode();    // コマンド実行
    }
    else{
      // テーブル検索失敗
      std::cout << "テーブル検索失敗";
      monitorIo_->send(command[0]);
      monitorIo_->send(": command not found.");
      ret = false;
    }
  }

  return ret;
}

/**
 * @brief コマンド分割
 * 入力されたコマンドを半角スペースで分割して、std::vectorに格納する。
 * 
 * @param commandBuf 入力コマンド
 * @return std::vector<std::string> 分割したコマンド
 */
std::vector<std::string> SerialMonitor::spritCommand(std::string &commandBuf)    // コマンド分割
{
  std::istringstream iss(commandBuf);
  std::string token;
  std::vector<std::string> result;

  while (std::getline(iss, token, ' ')) {
    if(token.size() != 0){
      result.push_back(token);
    }
  }
/*
  for (const auto &str : result) {
    std::cout << str << std::endl;
  }
*/
  return result;
}


bool SerialMonitor::dummyExec(std::vector<std::string> command)
{
  std::cout << "SerialMonitor::dummyExec\n";
  monitorIo_->send("dummyExec\n");
  return true;
}

/**
 * @brief Helpコマンド処理
 * 
 * @param command 
 * @return true 
 * @return false 
 */
bool SerialMonitor::opecodeHelp(std::vector<std::string> command)   // help
{
//  monitorIo_->send("help\n");

  for (auto it = codeArray.begin(); it != codeArray.end(); ++it) {
    std::cout << it->help << "\n";
  }

  return true;
}


void listDir(fs::FS &fs, const char * dirname, uint8_t levels)
{
  Serial.printf("Listing directory: %s\n", dirname);

  File root = fs.open(dirname);
  if(!root){
    Serial.println("Failed to open directory");
    return;
  }
  if(!root.isDirectory()){
    Serial.println("Not a directory");
    return;
  }

  File file = root.openNextFile();
  while(file){
    esp_task_wdt_reset();  // ウォッチドッグをリセット
    if(file.isDirectory()){
      Serial.print("  DIR : ");
      Serial.print (file.name());
      time_t t= file.getLastWrite();
      struct tm * tmstruct = localtime(&t);
      Serial.printf("  LAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n",(tmstruct->tm_year)+1900,( tmstruct->tm_mon)+1, tmstruct->tm_mday,tmstruct->tm_hour , tmstruct->tm_min, tmstruct->tm_sec);
      if(levels){
        listDir(fs, file.path(), levels -1);
      }
    } else {
      Serial.print("  FILE: ");
      Serial.print(file.name());
      Serial.print("  SIZE: ");
      Serial.print(file.size());
      time_t t= file.getLastWrite();
      struct tm * tmstruct = localtime(&t);
      Serial.printf("  LAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n",(tmstruct->tm_year)+1900,( tmstruct->tm_mon)+1, tmstruct->tm_mday,tmstruct->tm_hour , tmstruct->tm_min, tmstruct->tm_sec);
    }
    file = root.openNextFile();
  }

  return;
}

bool SerialMonitor::opecodels(std::vector<std::string> command_)     // ls
{
  Serial.print("opecodels");

  for (const auto &str : command) {
    std::cout << str << std::endl;
  }
  if(command.size() > 1){
    listDir(SPIFFS, command[1].c_str(), 0);
  }
  else{
    listDir(SPIFFS, "/", 0);
  }

  return true;
}

bool SerialMonitor::opecodedatalist(std::vector<std::string> command)   // datalist
{

  std::for_each(jsData.dataFilePath.begin(), jsData.dataFilePath.end(), [](std::string x) {
    Serial.println(x.c_str());
  });

  return true;
}

/**
 * @brief 設定値表示
 * 
 * @param command 
 * @return true 
 * @return false 
 */
bool SerialMonitor::opecodeenv(std::vector<std::string> command)
{
  Serial.println("opecodeenv");
  Serial.printf("glowInTheBright: %d\n", jsData.glowInTheBright);
  Serial.printf("rotatePosition: %d\n", jsData.rotatePosition);
  Serial.printf("dotColor: %d\n", jsData.dotColor);
  Serial.printf("showSampleData: %d\n", jsData.showSampleData);
  Serial.printf("dataNumber: %d\n", jsData.getDataNumber());

  return true;
}
