#include "pongWars.h"
#include <cmath>
#include <algorithm>

// 挙動チューニング用の定数（必要に応じて調整）
namespace {
  constexpr float kInitDayX      = PongWars::WIDTH - 4.0f;
  constexpr float kInitNightX    = 3.5f;
  constexpr float kInitY         = PongWars::HEIGHT * 0.5f;
  constexpr float kInitDayDX     = +0.60f;
  constexpr float kInitDayDY     = -0.45f;
  constexpr float kInitNightDX   = -0.60f;
  constexpr float kInitNightDY   = +0.45f;

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
/*
void PongWars::tick() {
  constexpr float EPS = 1e-4f;          // 境界めり込み・ループ貼り付き回避
  constexpr float EQ  = 1e-7f;          // tX と tY の同時判定しきい値

  // *** 式定義 ***

  // 実数座標→セル添字：floorで [i, i+1) に割当て、範囲外は 0..WIDTH-1 にクランプして配列外を防ぐ
  auto ix = [](float fx){ return PongWars::clampInt(int(std::floor(fx)), 0, PongWars::WIDTH  - 1); };
  // 実数座標→セル添字：floorで [j, j+1) に割当て、範囲外は 0..HEIGHT-1 にクランプして配列外を防ぐ
  auto iy = [](float fy){ return PongWars::clampInt(int(std::floor(fy)), 0, PongWars::HEIGHT - 1); };

  // 外周エッジでの反射（座標系は [0, W), [0, H) 前提）
  auto reflectEdges = [](float& pos, float& v, float min, float max) {
    if (pos < min) { pos = min + (min - pos); v = -v; }
    else if (pos >= max) { pos = max - (pos - max); v = -v; }
  };

  // 次に当たるグリッド境界までの比率 t（0..remain 基準）を返す
  // フラクション法：dx>0 のときは (1 - fract)/dx、dx<0 のときは fract/|dx|
  auto nextT = [](float pos, float d) -> float {
    if (d == 0.0f) return std::numeric_limits<float>::infinity();
    float fract = pos - std::floor(pos);
    if (d > 0.0f) {
      float dist = (1.0f - fract);
      return dist / d; // d>0
    } else {
      float dist = (fract);
      return dist / (-d); // d<0
    }
  };

  // *** グリッド境界反射 ***

  for (auto& b : balls_) {
    // ---- サブステップ分割：主成分が1px以下になるように ----
    // このフレームの移動量(px)
    const float adx = std::fabs(b.dx);   // x方向の絶対移動量
    const float ady = std::fabs(b.dy);   // y方向の絶対移動量

    // サブステップ数を決定：主成分の移動が 1px を超えないように分割する
    //  - max(|dx|, |dy|) を切り上げ → その回数だけ分割
    //  - 最低でも 1（= 分割なし）
    // 例) |dx|=1.8, |dy|=0.3 → max=1.8 → ceil=2 → 1サブステップあたり (0.9, 0.15)
    const int steps = std::max(1, int(std::ceil(std::max(adx, ady))));

    // サブステップあたりの速度（1フレームの移動量を steps 等分して扱う）
    // → 主成分の移動が 1px を超えないようにし、境界の取りこぼし（トンネリング）を防ぐ
    float vx = b.dx / steps;  // x方向の分割後速度 [px/サブステップ]
    float vy = b.dy / steps;  // y方向の分割後速度 [px/サブステップ]

    // 作業用の位置（サブステップの計算で更新していき、最後に b.x/b.y に反映する）
    // → 直接 b を動かさないことで、サブステップ内の複数回の境界処理・反射に耐える
    float x = b.x;  // 現在のx座標（連続座標系）
    float y = b.y;  // 現在のy座標（連続座標系）

    // サブステップループ
    for (int s = 0; s < steps; ++s) {
      float remain = 1.0f;  // このサブステップ内でまだ進むべき相対距離(0..1)。
                            // 境界までの割合 t を順に消費していき、複数の境界交差を
                            // 1サブステップ内で安全に処理するための残量カウンタ。

      // 念のため上限回数（境界連続ヒットの暴走防止）
      for (int guard = 0; guard < 8 && remain > 0.0f; ++guard) {
        // 連続座標 (x,y) → セル添字（floor+clamp）
        // ここでの cx, cy は「ボールが今いるマス」のインデックス
        const int cx = ix(x);
        const int cy = iy(y);

        // 現在マスの“盤面（背景）”の論理色（Day / Night）を取得
        // ※ ボールの見た目の点灯/消灯ではなく、盤面の色データ。
        // ※ makeData() のボール上書き表示には影響されない。
        // この値を使って、敵色→自分色へ入ろうとした瞬間の衝突判定を行う。
        const Cell curColor = grid_[cx][cy];  // 現在セルの色

        // この残り距離(remain)の中で「最初に跨ぐ」X/Y 格子線までの相対時間 t を求める（0..∞）
        // nextT は「次の格子線までの距離 / その軸の速度」を返す。
        // その軸の速度が 0 の場合は ∞（= その軸では交差しない）。
        float tX = nextT(x, vx);
        float tY = nextT(y, vy);

        // 先に当たるのは相対時間が小さい方。tX==tY（誤差内）なら角（同時交差）扱い。
        float tCross = std::min(tX, tY);

        // 残り距離内に交差が「無い」場合：tCross > remain（または ∞）
        // → 境界処理は行わず、このサブステップの終点まで一気に進む。
        if (!(tCross <= remain)) {
          x += vx * remain;
          y += vy * remain;
          remain = 0.0f;
          break;
        }

        // ここに来るのは tCross <= remain のとき（= 残りの中に最低1回は境界交差がある）
        // ※ tCross == remain の“ぴったり端”も交差「あり」として扱い、以降で
        //    交差直前/直後への移動、色境界の衝突判定→反転→反射処理へ進む。

        // tX: 次の縦格子線(X境界)までの相対時間, tY: 次の横格子線(Y境界)までの相対時間
        // 先に当たるのは相対時間が小さい方。ただし浮動小数誤差でほぼ同時のことがあるため、
        // EQ 以内の差は「同時交差（角）」として両方 true にする。
        bool crossX = (tX <= tY + EQ); // Xが先 or 誤差内で同時 → X境界を跨ぐ
        bool crossY = (tY <= tX + EQ); // Yが先 or 誤差内で同時 → Y境界を跨ぐ
        // 結果： (true,false)=Xのみ, (false,true)=Yのみ, (true,true)=角（両軸）
        // (false,false)=交差なしはこの上の if で弾かれている

        // 交差直前まで進める（わずかに手前で止める）
        // tCross : このサブステップ内で「最初に」格子線に達する相対時間(0..1)
        // EPS    : 浮動小数の誤差で境界にピタリ張り付いたり往復しないようにする微小量
        // → tCross そのものまで進まず、(tCross - EPS) だけ進めて境界の手前で一旦停止する
        float tAdvance = std::max(0.0f, tCross - EPS);
        x += vx * tAdvance;   // 手前まで前進（x）
        y += vy * tAdvance;   // 手前まで前進（y）
        remain -= tAdvance;   // このサブステップで残っている相対距離を消費

        // 交差直後に移る to セルを決める
        // crossX : 今回の交差が「縦格子線(X境界)」を跨ぐか（誤差内で同時なら true）
        // crossY : 今回の交差が「横格子線(Y境界)」を跨ぐか（誤差内で同時なら true）
        // cx,cy  : 現在セル（floorで求めた「今いるマス」）
        // vx,vy  : このサブステップでの速度。符号で次に進む向きが決まる
        //  - crossX が true なら、X 方向に 1 列隣のセルへ（右進行なら +1、左進行なら -1）
        //  - crossY が true なら、Y 方向に 1 行隣のセルへ（下進行なら +1、上進行なら -1）
        //  - crossX と crossY が両方 true のときは「角」を跨ぐ → 斜め隣のセル（±1, ±1）
        int toX = cx + (crossX ? ((vx > 0.0f) ? 1 : -1) : 0);
        int toY = cy + (crossY ? ((vy > 0.0f) ? 1 : -1) : 0);

        // ※ ここで求めた (toX,toY) は「これから入り込もうとしているセル」。
        //    このあと to セルの色を参照して「敵色→自分色なら衝突」と判定し、衝突なら
        //    ・to セルを 1 ドットだけ反転
        //    ・跨いだ境界の法線方向に速度を反転（角なら両軸）
        //    ・x,y を境界から微小に押し戻す（EPS）
        //    …といった処理に進む。
        //    なお外周を跨いで盤面外になる場合は「色境界」ではなく「壁反射」を優先して処理する。
        //    必要に応じて clampInt(toX,0,WIDTH-1) / clampInt(toY,0,HEIGHT-1) で配列外を防ぐ。

        // 壁越えの場合は、色境界ではなく「外周」で反射する（色処理は行わない）
        if (toX < 0 || toX >= WIDTH || toY < 0 || toY >= HEIGHT) {
          // 交差点までぴったり進める
          x += vx * (tCross - tAdvance);
          y += vy * (tCross - tAdvance);
          remain -= (tCross - tAdvance);

          // 外周で反射（座標を少し内側へ）
          reflectEdges(x, vx, 0.0f, float(WIDTH));
          reflectEdges(y, vy, 0.0f, float(HEIGHT));
          x += vx * EPS;
          y += vy * EPS;
          remain -= EPS;             // 微小分だけ残りを消費
          if (remain < 0.0f) remain = 0.0f;
          continue;
        }

        // to セルの色
        toX = PongWars::clampInt(toX, 0, PongWars::WIDTH  - 1);   // クランプ処理
        toY = PongWars::clampInt(toY, 0, PongWars::HEIGHT - 1);   // クランプ処理
        const Cell toColor = grid_[toX][toY];   // これから入ろうとしているセルの色の取得

        // ===== 色境界の衝突判定：敵色 → 自分色に入る瞬間 =====
        if (curColor != b.team && toColor == b.team) {
          // (1) 交差点まで進める
          x += vx * (tCross - tAdvance);
          y += vy * (tCross - tAdvance);
          remain -= (tCross - tAdvance);

          // (2) 衝突セル（to）を1ビットだけ反転
          grid_[toX][toY] = (toColor == Cell::Day) ? Cell::Night : Cell::Day;

          // (3) 反射（角は両軸）
          if (crossX) vx = -vx;
          if (crossY) vy = -vy;

          // (4) 境界から微小に押し戻す（次ループで再衝突しないように）
          x += vx * EPS;
          y += vy * EPS;
          remain -= EPS;
          if (remain < 0.0f) remain = 0.0f;

          // このサブステップの残り距離で続行（while ループ継続）
          continue;
        }

        // ===== 衝突なし：境界を素通り =====
        // 境界“直後”へ一歩出す（貼り付き防止）
        x += vx * (tCross - tAdvance + EPS);
        y += vy * (tCross - tAdvance + EPS);
        remain -= (tCross - tAdvance + EPS);
        if (remain < 0.0f) remain = 0.0f;
      } // guard
      // サブステップ末尾：外周反射を最終チェック
      reflectEdges(x, vx, 0.0f, float(WIDTH));
      reflectEdges(y, vy, 0.0f, float(HEIGHT));
    } // steps

    // 反映
    b.x  = x;  b.y  = y;
    b.dx = vx * steps;
    b.dy = vy * steps;

    // ノイズ＆速度レンジ（必要に応じて調整）
    addRandomness(b.dx, b.dy, kRandAmplitude);
    clampSpeed(b.dx, b.dy, kMinSpeed, kMaxSpeed);
  }

  return;
}
*/

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
        if (crossX) dx = -dx;
        if (crossY) dy = -dy;

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
    clampSpeed(b.dx, b.dy, kMinSpeed, kMaxSpeed);
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

    if (ballXorOverlay_) {
      // 背景が点いていても消えていても「見える」ようにXORで反転表示（表示専用）
      out[bx] ^= static_cast<uint8_t>(1u << bit);
    } else {
      // 反転を避けたい場合：常に点灯で上書き（明るい面では目立ちにくい）
      out[bx] |= static_cast<uint8_t>(1u << bit);
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

