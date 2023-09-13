export const RENDER_MODES = {
  INIT: '初始化',
  MOBILE: '移动端全屏模式',
  DESKTOP: '桌面端全屏模式',
  WINDOW: '桌面端窗口化模式',
};

interface Config {
  breakpoints: [number, number]; // MOBILE ~ DESKTOP 分界线；DESKTOP ~ WINDOW 分界线；
  windowSize: [number, number]; // 窗口化模式下窗口的尺寸
  showDevInfo: boolean; // 显示调试信息
  showStoryboard: boolean; // 显示开屏广告
  showBackground: boolean; // 显示背景图层
  enableMobileNoScaleHack: boolean; // 是否启用移动端禁止缩放hack
}

export const config: Config = {
  enableMobileNoScaleHack: true,
  showDevInfo: false,
  showStoryboard: false,
  showBackground: true,
  breakpoints: [660, 9999],
  windowSize: [1100, 760],
};
