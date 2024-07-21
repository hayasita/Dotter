set(SRC_FILES 
    #main.cpp
#    func.cpp
#    driver_sub.cpp
    # 追加のソースファイル
)

add_library(
    monitor

    monitor.cpp
)

add_library(
  wifiCtrl
  wifi_ctrl.cpp
)
