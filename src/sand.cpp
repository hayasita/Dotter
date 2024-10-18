

#include "sand.h"

Grain::Grain(void)
{
  posiX_ = 4.0f;
  posiY_ = 4.0f;
  mode = 0;
  return;
}

void Grain::roll(float angleX, float angleY,std::vector<uint8_t> *pageData) {
  // Simple physics to move the grain based on angles
  float nextX, nextY;

  float spdX = 0.0f;
  float spdY = 0.0f;

  spdX = std::tan(angleX);
  spdY = std::tan(angleY);
  if(spdX < -1.0f){
    spdX = -1.0f;
  }
  else if(spdX > 1.0f){
    spdX = 1.0f;
  }
  if(spdY < -1.0f){
    spdY = -1.0f;
  }
  else if(spdY > 1.0f){
    spdY = 1.0f;
  }


  nextX = posiX_ + ( 0.2 * std::tan(angleX) );
//  nextX = posiX_ + spdX;
  if (nextX < 0) nextX = 0;
  if (nextX > 7) nextX = 7;
  nextY = posiY_ + ( 0.2 * std::tan(angleY) );
//  nextY = posiY_ + spdY;
  if (nextY < 0) nextY = 0;
  if (nextY > 15) nextY = 15;

  if( (pageData == nullptr) || (pageData->size() <= 15) ){
    Serial.println("pageData is nullptr or size is less than 15");
    return;
  }
  else{

    (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
/*
    if( ((uint8_t)lastX_ == (uint8_t)nextX) && ((uint8_t)lastY_ == (uint8_t)nextY) ){
      posiX_ = nextX;
      posiY_ = nextY;
      lastX_ = posiX_;
      lastY_ = posiY_;
      mode = 0;
//      (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);
    }
    else 
*/
    if( ((*pageData)[(uint8_t)nextY] & (1 << (uint8_t)nextX)) == 0){
      mode = 1;
      posiX_ = nextX;
      posiY_ = nextY;

//      (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);

      lastX_ = posiX_;
      lastY_ = posiY_;
    }
/*
    else if( ((*pageData)[(uint8_t)nextY] & (1 << (uint8_t)nextX)) != 0){
      mode = 2;
      if(lastX_ < nextX){
        posiX_ = std::nextafter(nextX, -std::numeric_limits<float>::infinity());
      }
      else if(lastX_ > nextX){
        posiX_ = std::nextafter(nextX, std::numeric_limits<float>::infinity());
      }
      else{
        posiX_ = lastX_;
      }

     if(lastY_ < nextY){
        posiY_ = std::nextafter(nextY, -std::numeric_limits<float>::infinity());
      }
      else if(lastY_ > nextY){
        posiY_ = std::nextafter(nextY, std::numeric_limits<float>::infinity());
      }
      else{
        posiY_ = lastY_;
      }

//      (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);
      
      lastX_ = posiX_;
      lastY_ = posiY_;

    }
*/
    else if( ((*pageData)[(uint8_t)nextY] & (1 << (uint8_t)lastX_)) == 0){
      mode = 3;
      posiX_ = lastX_;
      posiY_ = nextY;

//      (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);

      lastX_ = posiX_;
      lastY_ = posiY_;
    }
/*
    else if( ((*pageData)[(uint8_t)nextY] & (1 << (uint8_t)lastX_)) != 0){
      mode = 4;
      posiX_ = lastX_;
      if(lastY_ < nextY){
        posiY_ = std::nextafter(nextY, -std::numeric_limits<float>::infinity());
      }
      else if(lastY_ > nextY){
        posiY_ = std::nextafter(nextY, std::numeric_limits<float>::infinity());
      }
      else{
        posiY_ = lastY_;
      }

//      (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);

      lastX_ = posiX_;
      lastY_ = posiY_;

    }
*/
    else if( ((*pageData)[(uint8_t)lastY_] & (1 << (uint8_t)nextX)) == 0){
      mode = 5;
      posiX_ = nextX;
      posiY_ = lastY_;

//      (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);

      lastX_ = posiX_;
      lastY_ = posiY_;
    }
/*
    else if( ((*pageData)[(uint8_t)lastY_] & (1 << (uint8_t)nextX)) != 0){
      mode = 6;
      if(lastX_ < nextX){
        posiX_ = std::nextafter(nextX, -std::numeric_limits<float>::infinity());
      }
      else if(lastX_ > nextX){
        posiX_ = std::nextafter(nextX, std::numeric_limits<float>::infinity());
      }
      else{
        posiX_ = lastX_;
      }
      posiY_ = lastY_;

//      (*pageData)[(uint8_t)lastY_] &= ~(1 << (uint8_t)lastX_);
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);

      lastX_ = posiX_;
      lastY_ = posiY_;
    }
*/

    else{
      mode = 7;
      posiX_ = lastX_;
      posiY_ = lastY_;
      (*pageData)[(uint8_t)posiY_] |= (1 << (uint8_t)posiX_);
    }
  }
  
  return;
}



Sand::Sand(void) {
  // Constructor implementation
  vecX = 0.0f;
  vecY = 0.0f;

  pageData.resize(16);

  //とりあえず一つ追加する
  grains.emplace_back();
}

Sand::~Sand() {
  // Destructor implementation
}

void Sand::grainAdd(void)
{
  grains.emplace_back();
  return;
}

std::vector<uint8_t> Sand::grainRoll(float angleX, float angleY)
{
  vecCal(angleX,angleY);

  for (auto &grain : grains) {
    grain.roll(vecX, vecY, &pageData);
  }

  return pageData;
}

void Sand::vecCal(float angleX, float angleY)
{
  // 角度をプラスマイナス45度で制限
  if (angleX < -45) angleX = -45;
  if (angleX > 45) angleX = 45;
  if (angleY < -45) angleY = -45;
  if (angleY > 45) angleY = 45;

  #if defined (M5STACK_ATOM)
    vecX = -(std::tan(angleX * M_PI / 180.0));
    vecY = -(std::tan(angleY * M_PI / 180.0));
  #else
    vecX = std::tan(angleX * M_PI / 180.0);
    vecY = std::tan(angleY * M_PI / 180.0);
  #endif
/*
  if(vecX < -1.0) vecX = -1.0;
  if(vecX > 1.0) vecX = 1.0;
  if(vecY < -1.0) vecY = -1.0;
  if(vecY > 1.0) vecY = 1.0;
*/
  return;
}

