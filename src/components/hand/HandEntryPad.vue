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
