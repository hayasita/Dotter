/**
 * @file sand.cpp
 * @author hayasita04@gmail.com
 * @brief 砂粒シミュレーション処理
 * @version 0.1
 * @date 2024-10-20
 * 
 * @copyright Copyright (c) 2024
 * 
 */
#include "sand.h"

Grain::Grain(float x, float y)
{
  rnd = generateRandomFloat(0.1f,0.3f);
  posiX_ = x;
  posiY_ = y;
  return;
}


float Grain::generateRandomFloat(float min, float max) {
  // Arduinoのrandom関数を使用して簡易的な乱数を生成
  return min + static_cast<float>(random(1000)) / 1000.0f * (max - min);
}

/**
 * @brief 
 * 
 * @param x  移動先X座標
 * @param y  移動先Y座標
 * @param vec 移動方向 
 * @param pageData  ページデータ
 * @return true 
 * @return false 
 */
bool Grain::isSpaceGrain(float x, float y, uint8_t vec8, std::vector<uint8_t> *pageData)  // 下方向判定
{
  bool ret = false;
  float nextX = lastX_;
  float nextY = lastY_;

  if( (vec8 == 2) || (vec8 == 6) ){ // 上方向
//    Serial.print("ベクトルの方向: 上：");
//    Serial.printf("%f,%f : %f,%f : %d\n",x,y,lastX_,lastY_,vec);
    if(y <= 15){
      // 移動先Yの行に空きがあるか判定
      if( ((*pageData)[(uint8_t)y] & (1 << (uint8_t)lastX_)) == 0){
        ret = true;
        nextX = lastX_;
        nextY = y;
//        Serial.println("上");
      }
      else if( ((uint8_t)lastX_ > 0) && ((uint8_t)lastX_ < 7) ){
        if( ((*pageData)[(uint8_t)y] & (1 << (uint8_t)lastX_ - 1)) == 0){
          ret = true;
          nextX = (uint8_t)lastX_ - 1;
          nextY = y;
//          Serial.println("左上");
        }
        else if( ((*pageData)[(uint8_t)y] & (1 << (uint8_t)lastX_ + 1)) == 0){
          ret = true;
          nextX = (uint8_t)lastX_ + 1;
          nextY = y;
//          Serial.println("右上");
        }
      }
      else if((uint8_t)lastX_ == 0){
        if( ((*pageData)[(uint8_t)y] & (1 << (uint8_t)lastX_ + 1)) == 0){
          ret = true;
          nextX = (uint8_t)lastX_ + 1;
          nextY = y;
//          Serial.println("右上");
        } 
      }
      else if((uint8_t)lastX_ == 7){
        if( ((*pageData)[(uint8_t)y] & (1 << (uint8_t)lastX_ - 1)) == 0){
          ret = true;
          nextX = (uint8_t)lastX_ - 1;
          nextY = y;
//          Serial.println("左上");
        }
      }
    }
  }
  else if( (vec8 == 0) || (vec8 == 4) ){ // 下方向
    if(x <= 7){
      // 移動先Xの行に空きがあるか判定
      if( ((*pageData)[(uint8_t)lastY_] & (1 << (uint8_t)x)) == 0){
        ret = true;
        nextX = x;
        nextY = lastY_;
//        Serial.println("下");
      }
      else if( ((uint8_t)lastY_ > 0) && ((uint8_t)lastY_ < 15) ){
        if( ((*pageData)[(uint8_t)lastY_ - 1] & (1 << (uint8_t)x)) == 0){
          ret = true;
          nextX = x;
          nextY = (uint8_t)lastY_ - 1;
//          Serial.println("左下");
        }
        else if( ((*pageData)[(uint8_t)lastY_ + 1] & (1 << (uint8_t)x)) == 0){
          ret = true;
          nextX = x;
          nextY = (uint8_t)lastY_ + 1;
//          Serial.println("右下");
        }
      }
      else if((uint8_t)lastY_ == 0){
        if( ((*pageData)[(uint8_t)lastY_ + 1] & (1 << (uint8_t)x)) == 0){
          ret = true;
          nextX = x;
          nextY = (uint8_t)lastY_ + 1;
//          Serial.println("右下");
        } 
      }
      else if((uint8_t)lastY_ == 15){
        if( ((*pageData)[(uint8_t)lastY_ - 1] & (1 << (uint8_t)x)) == 0){
          ret = true;
          nextX = x;
          nextY = (uint8_t)lastY_ - 1;
//          Serial.println("左下");
        }
      }
    }
  }

  posiX_ = nextX;
  posiY_ = nextY;

  return ret;
}

void Grain::roll(float accX, float accY, uint8_t vec8, std::vector<uint8_t> *pageData) {
  // Simple physics to move the grain based on angles
  float nextX, nextY;

  // 速度計算
  vecX_ = ( rnd * accX );
  vecY_ = ( rnd * accY );

  // 移動先座標計算
  nextX = posiX_ + vecX_;
  nextY = posiY_ + vecY_;

  // 移動範囲制限
  if (nextX < 0) nextX = 0;
  if (nextX > 7) nextX = 7;
  if (nextY < 0) nextY = 0;
  if (nextY > 15) nextY = 15;

  if( (pageData == nullptr) || (pageData->size() <= 15) ){
    Serial.println("pageData is nullptr or size is less than 15");
    return;
  }
  else{
    // Clear the current position
    (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);

    if( ((uint8_t)lastX_ == (uint8_t)nextX) && ((uint8_t)lastY_ == (uint8_t)nextY) ){
      // 前回位置と次回位置が同じ場合は同じ位置に留まる
      posiX_ = nextX;
      posiY_ = nextY;
    }
    else if( ((*pageData)[(uint8_t)nextY] & (1 << (uint8_t)nextX)) == 0){
      // 移動先にデータがない場合は移動する
      posiX_ = nextX;
      posiY_ = nextY;
    }
    else if(isSpaceGrain(nextX, nextY, vec8, pageData)){
      // 下方向に空間がある場合は下方向に移動する

    }
    else if( ((*pageData)[(uint8_t)nextY] & (1 << (uint8_t)lastX_)) == 0){
      // 移動先のY軸にデータがない場合はY軸のみ移動する
      posiX_ = lastX_;
      posiY_ = nextY;
    }
    else if( ((*pageData)[(uint8_t)lastY_] & (1 << (uint8_t)nextX)) == 0){
      // 移動先のX軸にデータがない場合はX軸のみ移動する
      posiX_ = nextX;
      posiY_ = lastY_;
    }
    else{
      // 移動できる場所がない場合は前回位置に留まる
      posiX_ = lastX_;
      posiY_ = lastY_;
    }

    (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);   // Set the new position
    lastX_ = posiX_;
    lastY_ = posiY_;
  }
  
  return;
}

void Grain::preRemoveProcess(std::vector<uint8_t> *pageData)
{
  // Clear the current position
  (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
  return;
}

/**
 * @brief Construct a new Sand:: Sand object
 * 
 */
Sand::Sand(void) {
  // Constructor implementation
  accX_ = 0.0f;
  accY_ = 0.0f;
//  vecX_ = 0.0f;
//  vecY_ = 0.0f;

  pageData.resize(16);

  //とりあえず一つ追加する
//  grains.emplace_back(4,0);

  removeGrainSqF = 0;
  return;
}

/**
 * @brief Destroy the Sand:: Sand object
 * 
 */
Sand::~Sand() {
  // Destructor implementation
}

/**
 * @brief 砂追加リクエスト
 * 
 */
void Sand::addGrainRequest(void)
{
  if(vec4 == 0){  // 右
    grains.emplace_back(0,7);
  }
  else if(vec4 == 1){ // 上
    grains.emplace_back(4,0);
  }
  else if(vec4 == 2){ // 左
    grains.emplace_back(7,7);
  }
  else if(vec4 == 3){ // 下
    grains.emplace_back(4,15);
  }

//  grains.emplace_back(4,0);
  return;
}

/**
 * @brief 砂除去リクエスト
 * 
 */
void Sand::removeGrainRequest(void)
{
  if(removeGrainSqF == 0){
    removeGrainSqF = 1;
    removeSqLastTime = millis();
//    Serial.println("removeGrainSqF = 1");
  }
  
  return;
}

/**
 * @brief 砂自動追加リクエスト
 * 
 */
void Sand::autoGrainRequest(void)
{
  static unsigned long lastTime = 0;
  static uint8_t removeCnt = 0;

  if( (millis() - lastTime) > 1000){
    if(grains.size() < 120){
      addGrainRequest();
    }
    removeCnt++;
    lastTime = millis();
  }

  if(grains.size() > 45){
    removeGrainRequest();
  }
  if(removeCnt >= 30){
    removeGrainRequest();
    removeCnt = 0;
  }

  return;
}

/**
 * @brief 砂除去シーケンス処理
 * 
 */
void Sand::removeGrainSq(std::vector<uint8_t> *pageData)
{

  if( (removeGrainSqF == 1) && ((millis() - removeSqLastTime) > 100) ){
    removeGrainSqF = 2;
    removeSqLastTime = millis();
//    Serial.println("removeGrainSqF = 2");
  }
  else if( (removeGrainSqF == 2) && ((millis() - removeSqLastTime) > 100) ){
    removeGrainSqF = 3;
    removeSqLastTime = millis();
//    Serial.println("removeGrainSqF = 3");
  }
  else if( (removeGrainSqF == 3) && ((millis() - removeSqLastTime) > 100) ){
    removeGrainSqF = 0;
    removeGrains();
  }

  if(removeGrainSqF == 1){
    if(vec4 == 0){  // 右
      // pageDataの全ての要素の7ビット目を0にする
      for (auto& byte : *pageData) {
        byte &= 0x7F; // 7ビット目を0にするためにAND演算を行う
      }
    }
    else if(vec4 == 1){ // 上
      (*pageData)[15] = 0x00;
    }
    else if(vec4 == 2){ // 左
      // pageDataの全ての要素の0ビット目を0にする
      for (auto& byte : *pageData) {
        byte &= 0xFE; // 0ビット目を0にするためにAND演算を行う
      }
    }
    else if(vec4 == 3){ // 下
      (*pageData)[0] = 0x00;
    }
  }
  
  return;
}

/**
 * @brief 砂粒移動処理
 * 
 * @param angleX 姿勢角度X
 * @param angleY 姿勢角度Y
 * @return std::vector<uint8_t> 表示データ
 */
std::vector<uint8_t> Sand::grainRoll(float angleX, float angleY)
{
  unsigned long currentTime = micros();

  accCal(angleX, angleY);               // 加速度計算
  vec4 = vecCal4(angleX, angleY);       // 方向計算
  vec8 = vecCal8(angleX, angleY);       // 方向計算

  // 砂移動処理
  for (auto &grain : grains) {
    grain.roll(accX_, accY_, vec8, &pageData);
  }

  pageDataTmp = pageData;
  removeGrainSq(&pageDataTmp);          // 砂除去リクエストシーケンス処理

  runTime = micros() - currentTime;     // 実行時間計測
  interval = millis() - lastTime;
  lastTime = millis();

  return pageDataTmp;
}

/**
 * @brief 角度から加速度を計算
 * 
 * @param angleX 
 * @param angleY 
 */
void Sand::accCal(float angleX, float angleY)
{
  float tmpX, tmpY;

  // 角度をプラスマイナス45度で制限
  if (angleX < -45) angleX = -45;
  if (angleX > 45) angleX = 45;
  if (angleY < -45) angleY = -45;
  if (angleY > 45) angleY = 45;

  #if defined (M5STACK_ATOM) || defined (M5STACK_ATOMS3)
    tmpX = -(std::tan(angleX * M_PI / 180.0));
    tmpY = -(std::tan(angleY * M_PI / 180.0));
  #else
    tmpX = std::tan(angleX * M_PI / 180.0);
    tmpY = std::tan(angleY * M_PI / 180.0);
  #endif

  if(tmpX < -1.0) tmpX = -1.0;
  else if(tmpX > 1.0) tmpX = 1.0;
  if(tmpY < -1.0) tmpY = -1.0;
  else if(tmpY > 1.0) tmpY = 1.0;

  accX_ = tmpX;
  accY_ = tmpY;

  return;
}

uint8_t Sand::vecCal4(float angleX, float angleY)
{
    // 角度をプラスマイナス45度で制限
    if (angleX < -45) angleX = -45;
    if (angleX > 45) angleX = 45;
    if (angleY < -45) angleY = -45;
    if (angleY > 45) angleY = 45;

    float vecX, vecY;

    #if defined (M5STACK_ATOM) || defined (M5STACK_ATOMS3)
        vecX = -(std::tan(angleX * M_PI / 180.0));
        vecY = -(std::tan(angleY * M_PI / 180.0));
    #else
        vecX = std::tan(angleX * M_PI / 180.0);
        vecY = std::tan(angleY * M_PI / 180.0);
    #endif

    // ベクトルの角度を計算
    float angle = std::atan2(vecY, vecX) * 180.0 / M_PI;

    // 角度を0-360度に変換
    if (angle < 0) angle += 360;

    // 4方向に分類
    const char* directions[] = {"右", "上", "左", "下"};
    uint8_t directionIndex = static_cast<int>((angle + 45) / 90) % 4;

    // 結果を出力
    // Serial.print("ベクトルの方向: ");
    // Serial.println(directions[directionIndex]);

    return directionIndex;
}

uint8_t Sand::vecCal8(float angleX, float angleY)
{
  // 角度をプラスマイナス45度で制限
  if (angleX < -45) angleX = -45;
  if (angleX > 45) angleX = 45;
  if (angleY < -45) angleY = -45;
  if (angleY > 45) angleY = 45;

    float vecX, vecY;

    #if defined (M5STACK_ATOM) || defined (M5STACK_ATOMS3)
        vecX = -(std::tan(angleX * M_PI / 180.0));
        vecY = -(std::tan(angleY * M_PI / 180.0));
    #else
        vecX = std::tan(angleX * M_PI / 180.0);
        vecY = std::tan(angleY * M_PI / 180.0);
    #endif

    // ベクトルの角度を計算
    float angle = std::atan2(vecY, vecX) * 180.0 / M_PI;

    // 角度を0-360度に変換
    if (angle < 0) angle += 360;

    // 8方向に分類
    const char* directions[] = {"右", "右上", "上", "左上", "左", "左下", "下", "右下"};
    uint8_t directionIndex = static_cast<int>((angle + 22.5) / 45) % 8;

    // 結果を出力
//    Serial.print("ベクトルの方向: ");
//    Serial.println(directions[directionIndex]);

  return directionIndex;
}


void Sand::removeGrains(void)                    // 砂除去処理
{
  if(vec4 == 0){  // 右
    removeGrainsWithX(7);
  }
  else if(vec4 == 1){ // 上
    removeGrainsWithY(15);
  }
  else if(vec4 == 2){ // 左
    removeGrainsWithX(0);
  }
  else if(vec4 == 3){ // 下
    removeGrainsWithY(0);
  }
  return;
}

/**
 * @brief   X座標指定で粒を削除
 * 
 * @param x 
 */
void Sand::removeGrainsWithX(uint8_t x)
{
  for (auto it = grains.begin(); it != grains.end(); ) {
    if (it->getX() == x) {
      it->preRemoveProcess(&pageData);  // pageDataから位置情報を削除
      it = grains.erase(it);            // 要素を削除
    } else {
      ++it;
    }
  }
  return;

}

/**
 * @brief   Y座標指定で粒を削除
 * 
 * @param y 
 */
void Sand::removeGrainsWithY(uint8_t y)
{
  for (auto it = grains.begin(); it != grains.end(); ) {
    if (it->getY() == y) {
      it->preRemoveProcess(&pageData);  // pageDataから位置情報を削除
      it = grains.erase(it);            // 要素を削除
    } else {
      ++it;
    }
  }
  return;
}

