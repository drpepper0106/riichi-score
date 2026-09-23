import pxToViewport from 'postcss-px-to-viewport-8-plugin'

/**
 * CSS px 按手机 1x 尺寸编写（375 逻辑宽），不是 750 设计稿 2x。
 * 375 屏上 16px → 4.27vw → 16px 显示。
 */
const viewportWidth = 375

export default {
  plugins: [
    pxToViewport({
      viewportWidth,
      unitPrecision: 5,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      mediaQuery: false,
      propList: ['*'],
      minPixelValue: 1,
      selectorBlackList: ['ignore-vw'],
      exclude: [/node_modules/],
    }),
  ],
}
