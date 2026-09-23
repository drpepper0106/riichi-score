export const fmt = (n) => Number(n).toLocaleString('zh-CN')

export function groupName(g) {
  if (g.type === 'quad') return g.open ? '明杠' : '暗杠'
  if (g.open) return g.type === 'seq' ? '吃' : '碰'
  return { seq: '顺子', trip: '刻子', pair: '对子', single: '单张' }[g.type]
}

export function handBuilder() {
  return { version: 3, area: 'hand', handType: 'single', meldType: 'seq', edit: null }
}

export function proposed(builder, tile) {
  return {
    type: builder.area === 'hand'
      ? (builder.handType === 'quad' ? 'quad' : 'single')
      : builder.meldType,
    tile,
    open: builder.area === 'open',
  }
}
