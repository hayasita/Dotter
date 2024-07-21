#ifndef filesys_h
#define filesys_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <cstdint>
#include <vector>
#include <string>

class datafileCtr{
  public:
    datafileCtr(void);                  // コンストラクタ
    const char* jsonFilePath(uint8_t num);    // dataFile path
    uint8_t size(void);

  private:
//    std::vector<std::string> dataFilePath;

};


#undef GLOBAL
#endif