#include "Freenove_VK16K33_Lib.h"

Freenove_VK16K33 matrix = Freenove_VK16K33();

byte x_array[][8] = {//Put the data into the left LED matrix
  //////////////////////////////////////////////
  0x00, 0x3C, 0x7E, 0x66, 0x66, 0x7E, 0x3C, 0x00,
  0x00, 0x3C, 0x7E, 0x7E, 0x7E, 0x7E, 0x3C, 0x00,
  //////////////////////////////////////////////
};

byte y_array[][8] = {//Put the data into the right LED matrix
  //////////////////////////////////////////////
  0x00, 0x3C, 0x7E, 0x66, 0x66, 0x7E, 0x3C, 0x00,
  0x00, 0x3C, 0x7E, 0x7E, 0x7E, 0x7E, 0x3C, 0x00,
  /////////////////////////////////////////////////
};

void setup()
{
  matrix.init(0x71);
  matrix.setBlink(VK16K33_BLINK_OFF);
}

void loop()
{
  showArray(500);
}


void showArray(int delay_ms)
{
  int count = sizeof(x_array) / sizeof(x_array[0]);
  for (int i = 0; i < count; i++)
  {
    matrix.showStaticArray(x_array[i], y_array[i]);
    delay(delay_ms);
  }
}
