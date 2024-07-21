

#include "device_driver.h"

ITM::ITM(unsigned char *swLists, unsigned char swNum) : tm(swLists, swNum)
{
  Serial.printf("ITM::ITM : %d , %d: %d\n", swLists[0], swLists[1], swNum);
  return;
}
ITM::~ITM()
{
  return;
}

uint8_t ITM::man(void){
  uint8_t ret = 0;
  String status;
  unsigned int shortonw;
  unsigned int longonw;

  tm.scan();                  // Update the terminaldata
  shortonw = tm.read_s();     // Read the short key input data
  longonw = tm.read_l();      // Read the long key input data

  status = "";
  if (shortonw != 0) {
    ret = shortonw;
    switch (shortonw) {
      case 0x01:
        status = "Short ON : BUTTON_0";
        break;
      case 0x02:
        status = "Short ON : BUTTON_1";
        break;
      case 0x03:
        status = "Short ON : BUTTON_0,1";
        break;
      default:
        status = "Short Other Key.";
        break;
    }
    Serial.printf("%s : 0x%02x\n", status.c_str(), ret);
  }
  else if (longonw != 0) {
    ret = longonw + 0x80;
    switch (longonw) {
      case 0x01:
        status = "Long ON : BUTTON_0";
        break;
      case 0x02:
        status = "Long ON : BUTTON_1";
        break;
      case 0x03:
        status = "Long ON : BUTTON_0,1";
        break;
      default:
        status = "Long ON : Other Key";
        break;
    }
    Serial.printf("%s : 0x%02x\n", status.c_str(), ret);
  }
  else {}

  return ret;
}
