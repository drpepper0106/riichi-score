<template>
  <section class="entry-pad all-tiles-pad" id="entry-pad">
    <div class="pad-heading">
      <h3>{{ builder.edit !== null ? '点牌替换这组' : builder.area === 'hand' ? '看到哪张，就点哪张' : '快速录入副露' }}</h3>
      <button class="text-button" type="button" @click="$emit('undo')">↶ 撤销</button>
    </div>

    <div class="pad-context">
      <button
        v-for="[v, label] in [['hand', '手牌区'], ['open', '副露区']]"
        :key="v"
        type="button"
        :class="{ selected: builder.area === v }"
        @click="builder.area = v; builder.edit = null"
      >{{ label }}</button>
    </div>

    <div class="pad-types">
      <button
        v-for="[v, label] in typeButtons"
        :key="v"
        type="button"
        :class="{ selected: currentType === v }"
        @click="setType(v)"
      >{{ label }}</button>
    </div>

    <p class="pad-instruction">{{ instruction }}</p>

    <div class="tile-library">
      <div v-for="(suitName, suit) in suitNames" :key="suit" class="library-row" :aria-label="`${suitName}牌库`">
        <button
          v-for="t in suitTiles(suit)"
          :key="t"
          class="library-tile"
          :class="{ 'has-copies': counts[t] }"
          :disabled="!canAdd(t)"
          :aria-label="`录入${RiichiHand.name(t)}，已录${counts[t]}张`"
          @click="$emit('pick', t)"
        >
          <MahjongTile :tile="t" />
          <span v-if="counts[t]" class="copy-count">{{ counts[t] }}</span>
        </button>
      </div>
    </div>

    <button v-if="builder.edit !== null" class="quiet full" type="button" @click="builder.edit = null">
      取消修改，继续录牌
    </button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import MahjongTile from '../common/MahjongTile.vue'
import RiichiHand from '../../engine/hand.js'

const props = defineProps({
  builder: { type: Object, required: true },
  counts: { type: Array, required: true },
  calc: { type: Object, required: true },
  canAdd: { type: Function, required: true },
})

defineEmits(['pick', 'undo'])

const suitNames = ['万', '筒', '索', '字牌']

const typeButtons = computed(() =>
  props.builder.area === 'hand'
    ? [['single', '逐张点牌'], ['quad', '暗杠']]
    : [['seq', '吃'], ['trip', '碰'], ['quad', '明杠 / 加杠']]
)

const currentType = computed(() =>
  props.builder.area === 'hand' ? props.builder.handType : props.builder.meldType
)

const instruction = computed(() => {
  const { calc, builder } = props
  if (calc.total === calc.target && builder.edit === null) {
    return '牌面已录满。点上方手牌可删除一张，或点副露组修改。'
  }
  if (builder.area === 'hand' && builder.handType === 'single') {
    return '点一次加一张，相同牌可连点；右上角显示已录张数。'
  }
  if (builder.area === 'open' && builder.meldType === 'seq') {
    return '点顺子的最小一张，自动生成整组吃牌。'
  }
  const t = builder.area === 'hand' ? builder.handType : builder.meldType
  return `点任意一张，自动生成${t === 'quad' ? '四' : '三'}张相同牌。`
})

function suitTiles(suit) {
  const len = suit === 3 ? 7 : 9
  return Array.from({ length: len }, (_, i) => suit * 9 + i)
}

function setType(v) {
  if (props.builder.area === 'hand') props.builder.handType = v
  else props.builder.meldType = v
}
</script>

<style scoped>
.entry-pad {
  margin-top: 20px;
  border-top: 1px solid var(--line);
  padding-top: 12px;
  scroll-margin-top: 15px;
}

.pad-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pad-heading h3 {
  margin: 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.pad-context,
.pad-types,
.suit-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 8px 0;
}

.pad-context > button,
.pad-types > button,
.suit-selector > button {
  flex: 1;
  padding: 10px 4px;
  font-size: 12px;
  min-width: 0;
}

.all-tiles-pad .pad-types > button {
  font-size: 13px;
}

.entry-pad button.selected {
  border-color: var(--green);
  background: var(--light);
  color: var(--green);
  box-shadow: inset 0 0 0 1px var(--green);
}

.entry-pad button.selected::before {
  content: none;
}

.suit-selector {
  margin-top: 14px;
}

.suit-selector .suit-button {
  font-size: 19px;
  font-family: serif;
  font-weight: 700;
}

.suit-button.suit-0 {
  color: #a4342d;
}

.suit-button.suit-1 {
  color: #344e89;
}

.suit-button.suit-2 {
  color: #237449;
}

.pad-instruction {
  font-size: 12px;
  color: var(--muted);
  margin: 12px 0;
}

.tile-library {
  display: grid;
  gap: 7px;
  margin: 14px 0 4px;
}

.library-row {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 3px;
}

.library-tile {
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 0;
  padding: 3px 0;
  border: 0;
  background: none;
  min-height: 53px;
  border-radius: 5px;
}

.library-tile :deep(.mahjong-tile) {
  width: 100%;
  height: auto;
  aspect-ratio: 44 / 68;
  max-width: 48px;
  min-width: 0;
  padding: 3px 2px 12px;
  border-bottom-width: 3px;
  border-radius: 4px;
}

.library-tile :deep(.tile-caption) {
  font-size: 8px;
}

.library-tile:hover:not(:disabled) {
  background: #dceadd;
}

.library-tile:active:not(:disabled) {
  transform: translateY(2px);
}

.library-tile:disabled {
  opacity: 0.36;
}

.copy-count {
  position: absolute;
  right: -1px;
  top: -3px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  background: var(--green);
  color: white;
  border: 1px solid white;
  border-radius: 10px;
  font-size: 10px;
  line-height: 13px;
  text-align: center;
  pointer-events: none;
}

.text-button {
  border: 0;
  background: none;
  color: var(--green);
  font-size: 13px;
  padding: 8px 4px;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.quiet {
  background: transparent;
  border: 0;
  color: var(--muted);
}

.full {
  width: 100%;
}

.all-tiles-pad {
  margin-top: 10px;
  padding-top: 7px;
}

.all-tiles-pad .pad-instruction {
  min-height: 20px;
  margin: 10px 0;
}

.all-tiles-pad .pad-types {
  margin-bottom: 0;
}
</style>
