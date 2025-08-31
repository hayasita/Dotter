#pragma once
#include <vector>
#include <cstdint>

/**
 * @brief 8x16 モノクロLEDマトリクス向け PongWars
 *
 * - 盤面: 幅16, 高さ8（左半分=Day、右半分=Night 初期化）
 * - ボール: 2つ（Day/Night）。壁で反射し、通過セルを自陣色に塗る
 * - 出力: 列0→15の各列を8bitに詰めてvector長さ16で返す
 *         既定: bit0=上(行0)。下をbit0にする場合は setBit0Top(false)
 * - 使用例:
 *     PongWars pw;            // 既定: Day=点灯, bit0=上
 *     pw.tick();              // 状態更新
 *     auto frame = pw.makeData(); // 16バイトをLEDへ転送
 */
class PongWars {
public:
  static constexpr int WIDTH  = 16;
  static constexpr int HEIGHT = 8;

  enum class Cell : uint8_t { Day = 0, Night = 1 };

  /**
   * @param dayLitOn  true: Day=点灯 / false: Day=消灯（Nightと反転）
   * @param bit0Top   true: bit0=上(行0) / false: bit0=下(行7)
   */
  explicit PongWars(bool dayLitOn = true, bool bit0Top = true);

  /** 盤面/ボールを初期化（左=Day, 右=Night / 2ボール配置） */
  void reset();

  /** 1ステップ進める（速度はpx/stepの固定ステップ） */
  void tick();

  /**
   * 表示用データ（列0→15、各列8bit）を返す
   * 既定: bit0=上。setBit0Top(false)でbit0=下に切替
   */
  std::vector<uint8_t> makeData() const;

  /** スピード調整（px/step）。負値で方向反転 */
  void setBallSpeed(float day_dx, float day_dy, float night_dx, float night_dy);

  /** Dayを点灯にするか（既定: true） */
  void setDayLitOn(bool on);

  /** bit0=上(true)/下(false) 切替 */
  void setBit0Top(bool top);

  /** Day/Night の占有数（デバッグ用） */
  void getScores(int& dayCount, int& nightCount) const;

  void setBallOverlayXor(bool enable) { ballXorOverlay_ = enable; }

private:
  struct Ball {
    float x, y;
    float dx, dy;
    Cell  team;
  };

  Cell grid_[WIDTH][HEIGHT];
  Ball balls_[2];
  bool dayLitOn_;
  bool bit0Top_;
  uint32_t rng_;

  bool ballXorOverlay_ = true; // true: XOR描画で必ず見える / false: OR描画(点灯上書き)

  // 乱数: [-1, +1) の擬似乱数
  float randMinus1to1();

  // ユーティリティ
  static int   clampInt(int v, int lo, int hi);
  static void  clampSpeed(float& dx, float& dy, float minSpd, float maxSpd);
  void         addRandomness(float& dx, float& dy, float amplitude);
  static void  reflectOneAxis(float& pos, float& d, float min, float max);
  static void  reflectOnWalls(float& x, float& y, float& dx, float& dy);
};

