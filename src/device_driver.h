#ifndef device_driver_h
#define device_driver_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <M5Unified.h>
#include "InputTerminal.h"

#if defined (M5STACK_ATOM)
  #define BUTTON_0 39
  #define BUTTON_1 19
#elif defined (M5STACK_ATOMS3)
  #define BUTTON_0 41
  #define BUTTON_1 6
#elif defined (M5STAMP_S3)
  #define BUTTON_0 0
  #define BUTTON_1 1
  #define SD_TRUE
#endif

class ITM{
  public:
    ITM(unsigned char *,unsigned char);
    ~ITM();

    uint8_t man(void);
  private:
    InputTerminal tm;

};


#undef GLOBAL
#endif