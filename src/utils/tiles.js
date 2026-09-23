import RiichiHand from '../engine/hand.js'

const HONOR_MAP = { 东: 27, 東: 27, 南: 28, 西: 29, 北: 30, 白: 31, 发: 32, 發: 32, 中: 33 }
const SUIT_LABELS = { m: '万', p: '筒', s: '索' }

export function tileFace(tile) {
  const n = tile % 9 + 1
  const s = tile < 27 ? Math.floor(tile / 9) : 3
  const ink = '#182e36'
  const green = '#126343'
  const red = '#b82c2b'
  let out = ''
  const pip = (x, y, r, c) =>
    `<g fill="none" stroke="${c}" stroke-width="1.8"><circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * 0.48}" stroke-width="1"/><path d="M${x - r},${y}h${r * 2} M${x},${y - r}v${r * 2}" stroke-width=".65"/></g>`
  const bamboo = (x, y, len = 12, angle = 0, c = green) =>
    `<g transform="translate(${x} ${y}) rotate(${angle})" stroke="${c}" stroke-linecap="round"><path d="M0 ${-len / 2}v${len}" stroke-width="4"/><path d="M-2.5 ${-len / 2}h5 M-2.5 0h5 M-2.5 ${len / 2}h5" stroke-width="1.5"/><path d="M-.6 ${-len / 2 + 2}v${len / 2 - 3} M-.6 2v${len / 2 - 3}" stroke="#e8f1df" stroke-width=".8"/></g>`

  if (s === 0) {
    out = `<text x="20" y="23" text-anchor="middle" fill="${ink}" font-family="serif" font-weight="bold" font-size="24">${'一二三四五六七八九'[n - 1]}</text><text x="20" y="49" text-anchor="middle" fill="${red}" font-family="serif" font-weight="bold" font-size="25">萬</text>`
  }
  if (s === 1) {
    const layouts = {
      1: [[20, 27, 14, ink]],
      2: [[20, 13, 8, green], [20, 41, 8, ink]],
      3: [[10, 12, 7, ink], [20, 27, 7, red], [30, 42, 7, green]],
      4: [[10, 13, 7, ink], [30, 13, 7, green], [10, 41, 7, green], [30, 41, 7, ink]],
      5: [[9, 11, 7, ink], [31, 11, 7, ink], [20, 27, 7, red], [9, 43, 7, ink], [31, 43, 7, ink]],
      6: [[10, 9, 6, green], [30, 9, 6, green], [10, 27, 6, red], [30, 27, 6, red], [10, 45, 6, red], [30, 45, 6, red]],
      7: [[8, 7, 5, red], [20, 13, 5, red], [32, 19, 5, red], [10, 32, 6, green], [30, 32, 6, green], [10, 46, 6, green], [30, 46, 6, green]],
      8: [[10, 7, 5.5, ink], [30, 7, 5.5, ink], [10, 20, 5.5, ink], [30, 20, 5.5, ink], [10, 34, 5.5, ink], [30, 34, 5.5, ink], [10, 47, 5.5, ink], [30, 47, 5.5, ink]],
      9: Array.from({ length: 9 }, (_, i) => [7 + (i % 3) * 13, 9 + Math.floor(i / 3) * 18, 5.5, [green, red, ink][Math.floor(i / 3)]]),
    }
    out = layouts[n].map((p) => pip(...p)).join('')
  }
  if (s === 2) {
    if (n === 1) {
      out = `<g stroke="${green}" fill="none" stroke-linecap="round">${[[5, 15], [10, 8], [18, 5], [26, 8], [33, 15]].map(([x, y]) => `<path d="M20 37Q${x} 26 ${x} ${y + 4}" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="3.3" ry="4.2" fill="#eff4df" stroke-width="1.7"/><circle cx="${x}" cy="${y}" r="1.4" fill="${ink}" stroke="none"/>`).join('')}<path d="M11 32Q17 25 22 31L24 38Q20 43 13 39Z" fill="${green}" stroke-width="1.2"/><path d="M20 35Q29 36 27 28Q25 23 29 22Q33 23 30 29Q33 39 25 44Q18 46 15 40" fill="#fffef7" stroke="${ink}" stroke-width="1.6"/><path d="M17 37Q26 34 25 40L20 42Z" fill="${red}" stroke="${red}"/><circle cx="29" cy="25" r="1" fill="${ink}" stroke="none"/><path d="M31 25L35 27L31 28 M22 44L20 49L15 49 M26 43L28 48L33 48" stroke="${red}" stroke-width="1.4"/></g>`
    } else if (n === 8) {
      out = [[9, 13, -31], [17, 13, 31], [23, 13, -31], [31, 13, 31], [9, 40, 31], [17, 40, -31], [23, 40, 31], [31, 40, -31]].map(([x, y, a]) => bamboo(x, y, 18, a)).join('')
    } else {
      const layouts = {
        2: [[20, 13], [20, 41]],
        3: [[20, 11], [10, 40], [30, 40]],
        4: [[10, 13], [30, 13], [10, 41], [30, 41]],
        5: [[9, 10], [31, 10], [20, 27], [9, 44], [31, 44]],
        6: [[10, 9], [30, 9], [10, 27], [30, 27], [10, 45], [30, 45]],
        7: [[20, 7], [8, 25], [20, 25], [32, 25], [8, 44], [20, 44], [32, 44]],
        9: Array.from({ length: 9 }, (_, i) => [8 + (i % 3) * 12, 9 + Math.floor(i / 3) * 18]),
      }
      out = layouts[n].map(([x, y], i) =>
        bamboo(x, y, n < 5 ? 17 : 12, 0, (n === 7 && i === 0) || (n === 5 && i === 2) || (n === 9 && i % 3 === 1) ? red : green)
      ).join('')
    }
  }
  if (s === 3) {
    out = tile === 31 ? '' : `<text x="20" y="41" text-anchor="middle" fill="${tile === 32 ? green : tile === 33 ? red : ink}" font-family="serif" font-size="36" font-weight="bold">${['東', '南', '西', '北', '白', '發', '中'][tile - 27]}</text>`
  }
  return `<svg class="tile-art" viewBox="0 0 40 54" aria-hidden="true">${out}</svg>`
}

export function looseTiles(hand) {
  return hand.groups
    .flatMap((g, i) => (!g.open && g.type !== 'quad' ? RiichiHand.groupTiles(g).map((tile) => ({ tile, index: i })) : []))
    .sort((a, b) => a.tile - b.tile)
}

export function parseTileExample(str) {
  if (!str) return []
  const items = []
  for (const token of str.split(' ')) {
    if (/^\d+[mps]$/.test(token)) {
      const offset = { m: 0, p: 9, s: 18 }[token.slice(-1)]
      for (const c of token.slice(0, -1)) items.push(offset + Number(c) - 1)
    } else {
      for (const c of token) {
        if (c in HONOR_MAP) items.push(HONOR_MAP[c])
      }
    }
  }
  return items
}

export { SUIT_LABELS, HONOR_MAP }
