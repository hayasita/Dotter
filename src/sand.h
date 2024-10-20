/**
 * @file sand.h
 * @author hayasita04@gmail.com
 * @brief 砂粒シミュレーション処理　ヘッダ
 * @version 0.1
 * @date 2024-10-20
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#ifndef SAND_H
#define SAND_H

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#include <M5UnitOLED.h>
#include <cstdint>
#include <vector>
#include "imu.h"

class Grain {
  public:
    Grain(float x, float y);
    float generateRandomFloat(float min, float max);
    void roll(float angleX, float angleY, uint8_t vec,std::vector<uint8_t> *pageData);
    bool isSpaceGrain(float x, float y, uint8_t vec, std::vector<uint8_t> *pageData);  // 下方向判定

    float getX() const { return posiX_; }
    float getY() const { return posiY_; }

    void preRemoveProcess(std::vector<uint8_t> *pageData);    // pageDataから位置情報を削除

    uint8_t mode;

  private:
    float rnd;      // 乱数
    float vecX_;    // 速度X
    float vecY_;    // 速度Y
    float posiX_;   // 位置X
    float posiY_;   // 位置Y
    float lastX_;   // 前回位置X
    float lastY_;   // 前回位置Y
};

class Sand {
  public:
    Sand();                               // コンストラクタ
    ~Sand();                              // デストラクタ

    void addGrainRequest(void);           // 砂追加リクエスト
    void removeGrainRequest(void);        // 砂除去リクエスト
    std::vector<uint8_t> grainRoll(float angleX, float angleY);   // 砂移動処理

    unsigned long runTime;                // 実行時間
    unsigned long lastTime;               // 前回実行時間
    unsigned long interval;               // 実行間隔高脂質症状

  private:
    std::vector<uint8_t> pageData;                // ページデータ内部保持用
    std::vector<uint8_t> pageDataTmp;             // ページデータ出力用

    void accCal(float angleX, float angleY);      // 加速度計算
    float accX_, accY_;                           // 加速度
    uint8_t vecCal4(float angleX, float angleY);  // 4方向ベクトル計算
    uint8_t vec4;                                 // 4方向ベクトル
    uint8_t vecCal8(float angleX, float angleY);  // 8方向ベクトル計算
    uint8_t vec8;                                 // 8方向ベクトル

    std::vector<Grain> grains;                    // 砂データ
    void removeGrainSq(std::vector<uint8_t> *pageData); // 砂除去処理
    unsigned long removeSqLastTime;               // 砂除去処理前回実行時間
    uint8_t removeGrainSqF;                       // 砂除去処理シーケンスフラグ
    void removeGrains(void);                      // 砂除去処理
    void removeGrainsWithX(uint8_t x);            // X座標指定砂除去処理
    void removeGrainsWithY(uint8_t y);            // Y座標指定砂除去処理

};

#undef GLOBAL
#endif // SAND_H