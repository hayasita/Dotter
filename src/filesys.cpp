
#include <FS.h>
#include "SPIFFS.h"
#include "filesys.h"
#include "jsdata.h"

datafileCtr::datafileCtr(void)
{
//  jsData.dataFilePath.push_back("/data/userData0.json");
//  jsData.dataFilePath.push_back("/data/data0.json");
//  jsData.dataFilePath.push_back("/data/data1.json");
//  jsData.dataFilePath.push_back("/data/data2.json");

  return;
}

const char* datafileCtr::jsonFilePath(uint8_t num)
{
  const char* ret;

  ret = jsData.dataFilePath[num].c_str();

  return ret;
}

uint8_t datafileCtr::size(void)
{
  return jsData.dataFilePath.size();
}
