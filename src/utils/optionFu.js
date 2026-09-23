import Riichi from '../engine/riichi.js'

export function optionFu(path, value, rules) {
  if (path === 'pair') {
    return value === 'number' ? '＋0 符' : value === 'dragon' ? '＋2 符' : `＋0 / 2${rules.doubleWind === 4 ? ' / 4' : ''} 符`
  }
  if (path === 'wait') {
    return ['kanchan', 'penchan', 'tanki'].includes(value) ? '＋2 符' : '＋0 符'
  }
  const match = /^melds\.(\d)\.(type|edge|source)$/.exec(path)
  if (!match) return ''
  const m = { ...arguments[2] }
  if (match[2] === 'type') {
    m.type = value
    m.edge = null
    m.source = null
  } else {
    m[match[2]] = value
  }
  if (m.type === 'seq') return '＋0 符'
  if (!m.type) return ''
  const values = [...new Set(
    (m.edge === null ? [false, true] : [m.edge]).flatMap((edge) =>
      (m.source ? [m.source] : ['open', 'closed']).map((source) =>
        Riichi.meldFu({ ...m, edge, source })
      )
    )
  )].sort((a, b) => a - b)
  return '＋' + (values.length === 1 ? values[0] : `${values[0]}～${values[values.length - 1]}`) + ' 符'
}

export function optionFuForMeld(meld, path, value, rules) {
  if (path.endsWith('.type') || path.endsWith('.edge') || path.endsWith('.source')) {
    const idx = Number(path.split('.')[1])
    void idx
    const m = { ...meld }
    const field = path.split('.').pop()
    if (field === 'type') {
      m.type = value
      m.edge = null
      m.source = null
    } else {
      m[field] = value
    }
    if (m.type === 'seq') return '＋0 符'
    if (!m.type) return ''
    const values = [...new Set(
      (m.edge === null ? [false, true] : [m.edge]).flatMap((edge) =>
        (m.source ? [m.source] : ['open', 'closed']).map((source) =>
          Riichi.meldFu({ ...m, edge, source })
        )
      )
    )].sort((a, b) => a - b)
    return '＋' + (values.length === 1 ? values[0] : `${values[0]}～${values[values.length - 1]}`) + ' 符'
  }
  return optionFu(path, value, rules)
}
