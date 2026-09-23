import { reactive, computed, watch } from 'vue'
import Riichi from '../engine/riichi.js'
import RiichiHand from '../engine/hand.js'
import { handBuilder } from '../utils/helpers.js'

const STORAGE_KEY = 'riichi-companion-v1'

function loadState() {
  const base = {
    ...Riichi.initial(),
    tab: 'calc',
    entry: 'hand',
    hand: RiichiHand.initial(),
    builder: handBuilder(),
    handUndo: null,
    expandedHan: false,
  }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.version === 1) {
      const merged = {
        ...base,
        ...saved.state,
        rules: { ...Riichi.RULES, ...saved.state.rules },
        hand: { ...RiichiHand.initial(), ...saved.state.hand },
        builder: saved.state.builder?.version === 3
          ? { ...handBuilder(), ...saved.state.builder, edit: null }
          : handBuilder(),
      }
      if (!Array.isArray(merged.melds) || merged.melds.length !== 4) return base
      return merged
    }
  } catch {
    /* ignore corrupt storage */
  }
  return base
}

const state = reactive(loadState())
const scrolls = reactive({ calc: 0, yaku: 0, table: 0 })
const detailState = reactive({})
const undo = reactive({ snapshot: null, timer: null })
const toast = reactive({ text: '', showUndo: false, visible: false, timer: null })

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }))
  } catch {
    /* storage full or unavailable */
  }
}

watch(state, save, { deep: true })

function notify(text, withUndo = false) {
  clearTimeout(toast.timer)
  toast.text = text
  toast.showUndo = withUndo
  toast.visible = true
  toast.timer = setTimeout(() => {
    toast.visible = false
  }, withUndo ? 8000 : 4000)
}

function currentEvaluation() {
  if (state.entry !== 'hand') return Riichi.evaluate(state)
  const c = RiichiHand.calculate(state.hand, state.rules)
  const b = c.best
  return {
    ...c,
    fu: b?.fu || {},
    han: b?.han,
    yakuman: b?.yakuman,
    result: b?.payment,
  }
}

const featureEvaluation = computed(() => Riichi.evaluate(state))

const handCalculation = computed(() => RiichiHand.calculate(state.hand, state.rules))

function setPath(path, value) {
  const parts = path.split('.')
  const key = parts.pop()
  const target = parts.reduce((obj, k) => obj[k], state)
  target[key] = value
}

function getPath(path) {
  return path.split('.').reduce((obj, k) => obj[k], state)
}

function switchTab(tab) {
  scrolls[state.tab] = window.scrollY
  state.tab = tab
  window.scrollTo(0, scrolls[tab] || 0)
}

function selectYaku(id) {
  if (state.yaku.includes(id)) {
    state.yaku = state.yaku.filter((y) => y !== id)
    return
  }
  const replaces = {
    doubleRiichi: 'riichi',
    ryanpeikou: 'iipeikou',
    chinitsu: 'honitsu',
    junchan: 'chanta',
    kokushi13: 'kokushi',
    suuankouTanki: 'suuankou',
    junseiChuuren: 'chuuren',
    daisuushii: 'shousuushii',
  }
  const old = replaces[id]
  if (old && state.yaku.includes(old)) {
    state.yaku = state.yaku.filter((y) => y !== old)
    notify(`已用${Riichi.YAKU.find((y) => y.id === id).name}替换${Riichi.YAKU.find((y) => y.id === old).name}`)
  }
  state.yaku.push(id)
}

function checkpointHand() {
  state.handUndo = JSON.parse(JSON.stringify({ hand: state.hand, builder: state.builder }))
}

function repairWinTile() {
  if (state.hand.winTile !== null && !RiichiHand.inspect(state.hand).loose[state.hand.winTile]) {
    state.hand.winTile = null
    notify('原和牌张已移除，请重新选择。')
  }
}

function canAddTile(tile) {
  const g = {
    type: state.builder.area === 'hand'
      ? (state.builder.handType === 'quad' ? 'quad' : 'single')
      : state.builder.meldType,
    tile,
    open: state.builder.area === 'open',
  }
  const copy = { ...state.hand, groups: state.hand.groups.slice() }
  if (state.builder.edit === null) copy.groups.push(g)
  else copy.groups[state.builder.edit] = g
  return !RiichiHand.inspect(copy).errors.length
}

function pickTile(tile) {
  const b = state.builder
  const g = {
    type: b.area === 'hand' ? (b.handType === 'quad' ? 'quad' : 'single') : b.meldType,
    tile,
    open: b.area === 'open',
  }
  const copy = { ...state.hand, groups: state.hand.groups.slice() }
  if (b.edit === null) copy.groups.push(g)
  else copy.groups[b.edit] = g
  const check = RiichiHand.inspect(copy)
  if (check.errors.length) {
    notify(check.errors[0])
    return
  }
  checkpointHand()
  state.hand.groups = copy.groups
  repairWinTile()
  b.edit = null
  if (b.area === 'hand') b.handType = 'single'
}

function removeLooseTile(index, tile) {
  const g = state.hand.groups[index]
  if (!g || g.open || g.type === 'quad') return
  checkpointHand()
  const ts = RiichiHand.groupTiles(g)
  const at = ts.indexOf(tile)
  if (at >= 0) {
    ts.splice(at, 1)
    state.hand.groups.splice(
      index,
      1,
      ...ts.map((t) => ({ type: 'single', tile: t, open: false }))
    )
    state.builder.edit = null
    repairWinTile()
  }
}

function removeGroup(index) {
  if (!state.hand.groups[index]) return
  checkpointHand()
  state.hand.groups.splice(index, 1)
  state.builder.edit = null
  repairWinTile()
}

function undoHand() {
  if (!state.handUndo) {
    notify('暂无可撤销的录入操作')
    return
  }
  const old = state.handUndo
  Object.assign(state.hand, old.hand)
  Object.assign(state.builder, { ...handBuilder(), ...old.builder, edit: null })
  state.handUndo = null
  notify('已撤销上一步')
}

function resetHand() {
  checkpointHand()
  const { seat, round } = state.hand
  Object.assign(state.hand, { ...RiichiHand.initial(), seat, round })
  Object.assign(state.builder, handBuilder())
  notify('已清空，保留场风和自风。可点“撤销”恢复。')
}

function fillOrphans() {
  if (state.hand.groups.length) {
    notify('请先清空牌面，再使用国士快捷填充。')
    return
  }
  checkpointHand()
  state.hand.groups = RiichiHand.ORPHANS.map((tile) => ({ type: 'single', tile, open: false }))
  Object.assign(state.builder, handBuilder())
  notify('已填十三种幺九牌，再补一张重复的牌。')
}

function resetFeature() {
  undo.snapshot = JSON.parse(JSON.stringify(state))
  clearTimeout(undo.timer)
  const { rules, entry, hand, builder, handUndo } = state
  Object.assign(state, {
    ...Riichi.initial(),
    rules: { ...rules },
    entry,
    hand,
    builder,
    handUndo,
    tab: state.tab,
  })
  Object.keys(detailState).forEach((k) => delete detailState[k])
  window.scrollTo({ top: 0, behavior: 'smooth' })
  notify('已开始新的一手', true)
  undo.timer = setTimeout(() => {
    undo.snapshot = null
  }, 8000)
}

function undoFeature() {
  if (!undo.snapshot) return
  Object.assign(state, undo.snapshot)
  undo.snapshot = null
  toast.visible = false
}

function applyYaku() {
  state.entry = 'features'
  const yc = Riichi.yakuCount(state)
  if (yc.yakuman) state.kind = 'yakuman'
  else if (state.yaku.includes('chiitoi') && state.fuMode === 'guided') state.kind = 'seven'
  else if (state.kind === 'yakuman') state.kind = 'normal'
  state.hanMode = 'yaku'
  switchTab('calc')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function fillSeqMelds() {
  let hasOpen = state.melds.some((m) => m.source === 'open')
  for (const m of state.melds) {
    if (!m.type) {
      m.type = 'seq'
      m.source = state.closed === false && !hasOpen ? 'open' : 'closed'
      if (m.source === 'open') hasOpen = true
    }
  }
  notify('已补齐空白面子为顺子，可逐组修改。')
}

function setMeldType(index, type) {
  if (state.melds[index].type !== type) {
    state.melds[index] = { type, edge: null, source: null }
  }
}

function increment(path, delta, max = 99) {
  setPath(path, Math.max(0, Math.min(max, getPath(path) + delta)))
}

function toggleHandEvent(event, checked) {
  state.hand.events = checked
    ? [...new Set([...state.hand.events, event])]
    : state.hand.events.filter((x) => x !== event)
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function useAppStore() {
  return {
    state,
    scrolls,
    detailState,
    undo,
    toast,
    Riichi,
    RiichiHand,
    notify,
    save,
    currentEvaluation,
    featureEvaluation,
    handCalculation,
    setPath,
    getPath,
    switchTab,
    selectYaku,
    checkpointHand,
    canAddTile,
    pickTile,
    removeLooseTile,
    removeGroup,
    undoHand,
    resetHand,
    fillOrphans,
    resetFeature,
    undoFeature,
    applyYaku,
    fillSeqMelds,
    setMeldType,
    increment,
    toggleHandEvent,
    scrollTo,
  }
}
