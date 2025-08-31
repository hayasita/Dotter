#include "pongWars.h"
#include <cmath>
#include <algorithm>

// 挙動チューニング用の定数（必要に応じて調整）
namespace {
  constexpr float kInitDayX      = PongWars::WIDTH - 4.0f;
  constexpr float kInitNightX    = 3.5f;
  constexpr float kInitY         = PongWars::HEIGHT * 0.5f;

  constexpr float kInitDX        = 0.60f;
  constexpr float kInitDY        = 0.45f;
  constexpr float kInitDayDX     = kInitDX;
  constexpr float kInitDayDY     = -kInitDY;
  constexpr float kInitNightDX   = -kInitDX;
  constexpr float kInitNightDY   = kInitDY;

  constexpr float kRandAmplitude = 0.01f;  // 微小ランダム性（0で無効）
  constexpr float kMinSpeed      = 0.35f;
  constexpr float kMaxSpeed      = 0.95f;

  constexpr uint32_t kLCG_A = 1664525u;
  constexpr uint32_t kLCG_C = 1013904223u;
}

PongWars::PongWars(bool dayLitOn, bool bit0Top)
  : dayLitOn_(dayLitOn), bit0Top_(bit0Top), rng_(0x12345678u) {
  reset();
}

void PongWars::reset() {
  // 左半分 Day、右半分 Night に初期化
  for (int x = 0; x < WIDTH; ++x) {
    for (int y = 0; y < HEIGHT; ++y) {
      grid_[x][y] = (x < WIDTH / 2) ? Cell::Day : Cell::Night;
    }
  }

  // 2ボール初期化
  balls_[0] = Ball{ kInitDayX,   kInitY, kInitDayDX,   kInitDayDY,   Cell::Day   };
  balls_[1] = Ball{ kInitNightX, kInitY, kInitNightDX, kInitNightDY, Cell::Night };
}

void PongWars::tick() {
  constexpr float EPS = 1e-4f;

  // floor でセル番号を取る（丸め取り違え防止）
  auto ix = [](float fx){ return PongWars::clampInt(int(std::floor(fx)), 0, PongWars::WIDTH  - 1); };
  auto iy = [](float fy){ return PongWars::clampInt(int(std::floor(fy)), 0, PongWars::HEIGHT - 1); };

  // 次のグリッド線までの比率 t（0..1 の間で最初の交差）を返す
  auto nextT = [](float pos, float d) -> float {
    if (d > 0.0f) {
      float edge = std::floor(pos) + 1.0f;   // 正方向：次の整数境界
      return (edge - pos) / d;               // >= 0
    } else if (d < 0.0f) {
      float edge = std::floor(pos);          // 負方向：直前の整数境界（ここが肝）
      return (edge - pos) / d;               // d<0 → >= 0
    } else {
      return 1e30f;                          // 動かない軸は「交差しない」
    }
  };

  for (auto& b : balls_) {
    float x = b.x, y = b.y;
    float dx = b.dx, dy = b.dy;

    // 1フレームの終点
    const float nx = x + dx;
    const float ny = y + dy;

    // 現在セル
    const int cx = ix(x);
    const int cy = iy(y);
    const Cell curColor = grid_[cx][cy];

    // このフレームで最初に跨ぐ境界（X or Y or 角）を計算
    const float tX = nextT(x, dx);
    const float tY = nextT(y, dy);
    const float tCross = std::min(tX, tY);

    bool didColorCollision = false;

    if (tCross >= 0.0f && tCross <= 1.0f) {
      // 交差がフレーム内に存在 → その境界の向こう側セルを特定
      const float EQ = 1e-7f;
      const bool crossX = (tX <= tY + EQ);
      const bool crossY = (tY <= tX + EQ);

      int toX = cx + (crossX ? ((dx > 0.0f) ? 1 : -1) : 0);
      int toY = cy + (crossY ? ((dy > 0.0f) ? 1 : -1) : 0);
      toX = PongWars::clampInt(toX, 0, PongWars::WIDTH  - 1);
      toY = PongWars::clampInt(toY, 0, PongWars::HEIGHT - 1);

      const Cell toColor = grid_[toX][toY];

      // 色境界の衝突条件：敵色 → 自分色へ入ろうとした瞬間
//      if (curColor != b.team && toColor == b.team) {
      if (toColor == b.team) {
        // 1) 境界点まで進める
        x = x + dx * tCross;
        y = y + dy * tCross;

        // 2) 衝突セル（入ろうとした先）を反転
        grid_[toX][toY] = (toColor == Cell::Day) ? Cell::Night : Cell::Day;

        // 3) 反射（角なら両軸）
        applyReflection(crossX, crossY, dx, dy);

        // 4) めり込み防止に微小押し戻し
        x += dx * EPS;
        y += dy * EPS;

        didColorCollision = true;
      }
    }

    if (!didColorCollision) {
      // 色境界衝突なし → そのまま終点へ
      x = nx;
      y = ny;
    }

    // 外周壁の反射は最後に処理（色境界より優先させない）
    reflectOnWalls(x, y, dx, dy);

    // 反映
    b.x = x;  b.y = y;
    b.dx = dx; b.dy = dy;

    // ノイズ＆速度レンジ（任意・従来通り）
    addRandomness(b.dx, b.dy, kRandAmplitude);
//    clampSpeed(b.dx, b.dy, kMinSpeed, kMaxSpeed);   // 反射角45度、速度は常に初期値としたので不要？
  }
}

std::vector<uint8_t> PongWars::makeData() const {
  std::vector<uint8_t> out(WIDTH, 0);
  for (int x = 0; x < WIDTH; ++x) {
    uint8_t col = 0;
    for (int y = 0; y < HEIGHT; ++y) {
      const bool isDay = (grid_[x][y] == Cell::Day);
      const bool lit   = dayLitOn_ ? isDay : !isDay;   // Dayを点灯にするか
      if (lit) {
        const int bit = bit0Top_ ? y : (HEIGHT - 1 - y);
        col |= static_cast<uint8_t>(1u << bit);
      }
    }
    out[x] = col;
  }

  // ★ ここから：ボールの1ピクセルをオーバーレイ（盤面は変更しない）
  for (const auto& b : balls_) {
    const int bx  = clampInt(static_cast<int>(std::lround(b.x)), 0, WIDTH  - 1);
    const int by  = clampInt(static_cast<int>(std::lround(b.y)), 0, HEIGHT - 1);
    const int bit = bit0Top_ ? by : (HEIGHT - 1 - by);

    if(b.team == Cell::Day) {
      out[bx] |= static_cast<uint8_t>(1u << bit);
    }
    else{
      out[bx] &= ~static_cast<uint8_t>(1u << bit);
    }

  }

  return out;
}

void PongWars::setBallSpeed(float day_dx, float day_dy, float night_dx, float night_dy) {
  balls_[0].dx = day_dx;   balls_[0].dy = day_dy;
  balls_[1].dx = night_dx; balls_[1].dy = night_dy;
}

void PongWars::setDayLitOn(bool on) { dayLitOn_ = on; }
void PongWars::setBit0Top(bool top) { bit0Top_ = top; }

void PongWars::getScores(int& dayCount, int& nightCount) const {
  dayCount = nightCount = 0;
  for (int x = 0; x < WIDTH; ++x) {
    for (int y = 0; y < HEIGHT; ++y) {
      (grid_[x][y] == Cell::Day) ? ++dayCount : ++nightCount;
    }
  }
}

// ========= 内部ユーティリティ =========

float PongWars::randMinus1to1() {
  // 線形合同法 → [0,1) → [-1,1)
  rng_ = kLCG_A * rng_ + kLCG_C;
  const float u01 = static_cast<float>(rng_ & 0x00FFFFFFu) / static_cast<float>(0x01000000u); // [0,1)
  return u01 * 2.0f - 1.0f;
}

int PongWars::clampInt(int v, int lo, int hi) {
  return (v < lo) ? lo : (v > hi) ? hi : v;
}

void PongWars::clampSpeed(float& dx, float& dy, float minSpd, float maxSpd) {
  const float v2 = dx*dx + dy*dy;
  if (v2 <= 0.0f) { dx = minSpd; dy = 0.0f; return; }
  const float v = std::sqrt(v2);
  float s = v;
  if (s < minSpd) s = minSpd;
  if (s > maxSpd) s = maxSpd;
  if (s != v) {
    const float r = s / v;
    dx *= r; dy *= r;
  }
}

void PongWars::addRandomness(float& dx, float& dy, float amplitude) {
  if (amplitude <= 0.0f) return;
  dx += randMinus1to1() * amplitude;
  dy += randMinus1to1() * amplitude;
}

void PongWars::reflectOneAxis(float& pos, float& d, float min, float max) {
  if (pos < min) {
    pos = min + (min - pos);
    d = -d;
    if (pos > max) pos = min;   // 過剰反射の保険
  } else if (pos > max) {
    pos = max - (pos - max);
    d = -d;
    if (pos < min) pos = max;
  }
}

void PongWars::reflectOnWalls(float& x, float& y, float& dx, float& dy) {
  reflectOneAxis(x, dx, 0.0f, float(WIDTH  - 1));
  reflectOneAxis(y, dy, 0.0f, float(HEIGHT - 1));
}

/**
 * ボールの反射処理。
 * 反射方向で速度を反転する。
 * @param crossX X軸境界を跨いだか
 * @param crossY Y軸境界を跨いだか
 */
void PongWars::applyReflection(bool crossX, bool crossY, float& dx, float& dy) {
  if (crossX) {
    if (dx < 0) {
      dx = kInitDX;
    } else {
      dx = -kInitDX;
    }
  }
  if (crossY) {
    if (dy < 0) {
      dy = kInitDY;
    } else {
      dy = -kInitDY;
    }
  }
}
