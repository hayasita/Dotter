#ifndef SAND_H
#define SAND_H

#include "imu.h"

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <M5UnitOLED.h>
#include <cstdint>
#include <vector>

class Grain {
  public:
//    Grain(float x, float y) : x_(x), y_(y) {}
    Grain(void);

    void roll(float angleX, float angleY,std::vector<uint8_t> *pageData);

    float getX() const { return posiX_; }
    float getY() const { return posiY_; }

    uint8_t mode;

  private:
    float posiX_;
    float posiY_;
    float lastX_;
    float lastY_;
};

// クラスや関数の宣言をここに追加
class Sand {
  public:
    Sand();
    ~Sand();

    Grain grain;
    std::vector<Grain> grains;
    void grainAdd(void);

    std::vector<uint8_t> pageData;

    std::vector<uint8_t> grainRoll(float angleX, float angleY);
//    void display() const;

    float getVecX() const { return vecX; }
    float getVecY() const { return vecY; }

    void vecCal(float angleX, float angleY);
    float vecX;
    float vecY;

    unsigned long runTime;  // 実行時間
    unsigned long lastTime; // 前回実行時間
    unsigned long interval; // 実行間隔
};

#undef GLOBAL
#endif // SAND_H