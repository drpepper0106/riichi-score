<template>
  <div class="meld" :id="`meld-${index}`">
    <div class="meld-title">
      <h3><span>{{ index + 1 }}</span> 面子 {{ index + 1 }}</h3>
      <span class="fu-badge">{{ ready ? `＋${fu} 符` : '待选择' }}</span>
    </div>
    <ChoiceButtons
      :model-value="meld.type"
      :options="typeOpts"
      :fu-label="(v) => fuFor('type', v)"
      @update:model-value="onType"
    />
    <template v-if="meld.type">
      <p class="hint">{{ typeHint }}</p>
      <div v-if="meld.type !== 'seq'" class="field">
        <label>是哪类牌？</label>
        <ChoiceButtons
          :model-value="meld.edge"
          :options="edgeOpts"
          :fu-label="(v) => fuFor('edge', v)"
          @update:model-value="meld.edge = $event"
        />
      </div>
      <div class="field">
        <label>如何组成？</label>
        <ChoiceButtons
          :model-value="meld.source"
          :options="sourceOpts"
          :fu-label="(v) => fuFor('source', v)"
          @update:model-value="meld.source = $event"
        />
      </div>
      <p v-if="meld.source === 'ron'" class="note">这组刻子按明刻加符，但本次荣和不破坏门前清。</p>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import ChoiceButtons from '../common/ChoiceButtons.vue'
import { optionFuForMeld } from '../../utils/optionFu.js'

const props = defineProps({
  meld: { type: Object, required: true },
  index: { type: Number, required: true },
})

const { state, Riichi, setMeldType } = useAppStore()

const fu = computed(() => Riichi.meldFu(props.meld))
const ready = computed(() => props.meld.type && props.meld.source && (props.meld.type === 'seq' || props.meld.edge !== null))

const typeOpts = [
  { v: 'seq', t: '顺子' },
  { v: 'trip', t: '刻子' },
  { v: 'quad', t: '杠子' },
]
const edgeOpts = [{ v: false, t: '2～8 数牌' }, { v: true, t: '1、9 或字牌' }]

const sourceOpts = computed(() => {
  if (props.meld.type === 'seq') {
    return [{ v: 'closed', t: '手牌组成' }, { v: 'open', t: '吃牌组成' }]
  }
  if (props.meld.type === 'quad') {
    return [{ v: 'closed', t: '暗杠' }, { v: 'open', t: '明杠 / 加杠' }]
  }
  const opts = [{ v: 'closed', t: '自己摸齐' }, { v: 'open', t: '碰牌组成' }]
  if (state.win === 'ron' || props.meld.source === 'ron') opts.push({ v: 'ron', t: '本次荣和补齐' })
  return opts
})

const typeHint = computed(() => {
  if (props.meld.type === 'seq') return '同一花色，连续三张，如三四五万。'
  if (props.meld.type === 'trip') return '三张相同的牌。'
  return '四张相同的牌，已声明开杠。'
})

function fuFor(field, value) {
  const path = `melds.${props.index}.${field}`
  const m = { ...props.meld }
  if (field === 'type') {
    m.type = value
    m.edge = null
    m.source = null
  } else {
    m[field] = value
  }
  return optionFuForMeld(m, path, value, state.rules)
}

function onType(type) {
  setMeldType(props.index, type)
}
</script>
