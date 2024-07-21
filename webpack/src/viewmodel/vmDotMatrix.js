
export class DotMatrixUI {
  constructor() {
    console.log("-- DotMatrixUI constructor --");
    this.imageCounter = 0;
    this.animationInterval = null;
    this.rows = 8;
    this.cols = 16;
    this.dotcolor = 'rgb(255, 0, 0)';
    this.bgcolor = 'rgb(0, 0, 0)';

    // ドットマトリクス編集領域情報初期化
    this.colorMatrix = [];
    this.clearMatrix();
    console.log(this.colorMatrix);

    // アニメーション情報初期化
    this.animationData = [];
    // 転送用情報初期化
    this.submitData = [];
  }

  // ドットマトリクス編集領域情報作成
  createColorMatrix(rows, cols, initialColor) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => initialColor));
  }
  // ドットマトリクス編集領域情報クリア
  clearMatrix() {
    this.colorMatrix = this.createColorMatrix(this.rows, this.cols, this.bgcolor);
  }

  setDotcolor(color) {
    this.dotcolor = color;
  }

  // 指定位置のデータの色を反転し、新しい色を返す
  toggleDot(row, col) {
    const newColor = this.colorMatrix[row][col] !== this.dotcolor ? this.dotcolor : this.bgcolor;
    this.colorMatrix[row][col] = newColor;

    return newColor
  }

  // 画像データをアニメーション情報と転送用情報に追加
  addMiniImageData(index) {
    // メソッド内の実装を追加
    console.log("addMiniImageData")
    let mxTmp = this.colorMatrix.flat();                          // 一次元配列に変換
    this.animationData.splice(index + 1, 0, mxTmp);               //アニメーション情報に追加する

    let mxColorDat = mxTmp.map(x => this.convertColorToRGB(x));   //転送用データに変換
    this.submitData.splice(index + 1, 0, mxColorDat);            // 転送用情報に追加する
    console.log(this.animationData);
  }

  // 指定したアニメーションデータをドットマトリクス編集領域情報に設定する。
  setColorMatrix(index) {
    console.log("削除番号",index);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 16; col++) {
        this.colorMatrix[row][col] = this.animationData[index][row * this.cols + col];
      }
    }
  }

  // アニメーション情報、転送用情報の削除
  deleteMiniImageData(index) {
    this.animationData.splice(index, 1);
//    console.log(this.animationData);

    this.submitData.splice(index, 1);
//    console.log(this.submitData);
  }

  convertColorToRGB(colorString) {
    // 色の文字列からRGB値を抽出する
    let rgbArray = colorString.match(/\d+/g);
    // RGB値をオブジェクトに変換する
    let rgbObject = {
      r: parseInt(rgbArray[0]),
      g: parseInt(rgbArray[1]),
      b: parseInt(rgbArray[2])
    };

    let colorCode = 0;
    if(rgbArray[0] != 0){colorCode += 1}
    if(rgbArray[1] != 0){colorCode += 2}
    if(rgbArray[2] != 0){colorCode += 4}
//      console.log(colorCode + "\n");
    let colorObject = {
      c: parseInt(colorCode)
    };
      return colorObject;
//      return rgbObject;
  }

  convertCodeToString(code) {
    var color = "";
    switch(code) {
      case 0:
        color = "rgb(0, 0, 0)";
        break;
      case 1:
        color = "rgb(255, 0, 0)";
        break;
      case 2:
        color = "rgb(0, 255, 0)";
        break;
      case 3:
        color = "rgb(255, 255, 0)";
        break;
      case 4:
//        color = "rgb(65, 105, 255)";
        color = "rgb(0, 0, 255)";
        break;
      default:
        console.log("Invalid color code");
        return; // 無効なdotColorの場合は何もしない
    }
    return color;
  }

  updateMiniImagesIndexes() {
    // メソッド内の実装を追加
  }

  updateMiniImageSelector() {
    // メソッド内の実装を追加
  }

  animationTest() {
    // メソッド内の実装を追加
  }
}