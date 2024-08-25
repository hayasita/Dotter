#ifndef ota_h
#define ota_h

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

const char* updateHtml = R"=====(
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dotter OTA</title>
  <style>
    body {
      font-family: Verdana, sans-serif;
      font-size: 14px;
    }

    .container {
      width: 400px;
      padding: 20px;
      border-radius: 10px;
      border: solid 2px #e0e0e0;
      margin: auto;
      margin-top: 20px;
    }

    .header {
      width: 100%;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    #upload-form {
      width: 100%;
      margin-bottom: 8px;
    }

    .submit-button {
      float: right;
    }

    .progress-bar-container {
      width: 100%;
      background-color: #e0e0e0;
      border-radius: 8px;
      position: relative;
    }

    .progress-bar {
      width: 0%;
      background-color: #2196F3;
      padding: 2px;
      border-radius: 8px;
      color: white;
      text-align: center;
      position: relative;
    }

    .progress-text {
      text-align: center;
      margin-bottom: 5px;
    }

    .radio-group {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Dotter OTA</div>
    <form method="POST" action="#" enctype="multipart/form-data" id="upload-form">
      <div class="radio-group">
        <div>
          <input type="radio" id="firmware" name="filetype" value="firmware" checked>
          <label for="firmware">ファームウエア</label>
        </div>
        <div>
          <input type="radio" id="resource" name="filetype" value="resource">
          <label for="resource">リソースファイル</label>
        </div>
      </div>
      <div>
        <label for="file-input">ファイルを選択:</label>
        <input type="file" name="update" id="file-input" accept=".bin">
      </div>
      <input type="submit" value="Update" class="submit-button">
    </form>
    <div class="progress-text" id="progress-text">0%</div>
    <div class="progress-bar-container">
      <div id="prg" class="progress-bar"></div>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const prg = document.getElementById('prg');
      const progressText = document.getElementById('progress-text');
      const form = document.getElementById('upload-form');
      const fileInput = document.getElementById('file-input');
      const firmwareRadio = document.getElementById('firmware');
      const resourceRadio = document.getElementById('resource');

      const updateFileInputAccept = () => {
        if (firmwareRadio.checked) {
          fileInput.setAttribute('accept', '.bin');
        } else if (resourceRadio.checked) {
          fileInput.setAttribute('accept', '.spiffs');
        }
      };

      firmwareRadio.addEventListener('change', updateFileInputAccept);
      resourceRadio.addEventListener('change', updateFileInputAccept);

      form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        const req = new XMLHttpRequest();

        req.open('POST', '/update');
        req.upload.addEventListener('progress', p => {
          if (p.lengthComputable) {
            const w = Math.round((p.loaded / p.total) * 100) + '%';
            prg.style.width = w;
            progressText.innerHTML = w;
            if (w === '100%') {
              prg.style.backgroundColor = '#04AA6D';
            }
          }
        });

        req.addEventListener('load', () => {
          if (req.status === 200) {
            alert('アップロードが成功しました。');
          } else {
            alert('アップロードに失敗しました。');
          }
        });

        req.addEventListener('error', () => {
          alert('アップロード中にエラーが発生しました。');
        });

        req.send(data);
      });

      updateFileInputAccept(); // 初期設定
    });
  </script>
</body>
</html>
)=====";

#undef GLOBAL
#endif