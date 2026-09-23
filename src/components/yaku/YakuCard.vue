<template>
  <article class="yaku-card" :class="{ picked: checked }">
    <button
      v-if="selectable"
      class="yaku-pick"
      type="button"
      :aria-pressed="checked"
      @click="selectYaku(yaku.id)"
    >
      <span class="tick-box">{{ checked ? '✓' : '' }}</span>
      <span>
        <strong>{{ yaku.name }}</strong>
        <small>{{ meta }}</small>
      </span>
      <b class="yaku-value">{{ valueLabel }}</b>
    </button>
    <p>{{ yaku.desc }}</p>
    <details>
      <summary>牌例与易错点</summary>
      <TileExample :example="yaku.example" />
      <p>{{ yaku.tip }}</p>
      <small v-if="yaku.example" class="muted">展示役种结构；部分牌例省略其他面子。</small>
    </details>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import TileExample from '../common/TileExample.vue'

const props = defineProps({
  yaku: { type: Object, required: true },
  selectable: { type: Boolean, default: false },
})

const { state, selectYaku } = useAppStore()

const checked = computed(() => state.yaku.includes(props.yaku.id))

const meta = computed(() => {
  const y = props.yaku
  if (y.yakuman) return y.menzen ? '门前限定' : '可副露'
  return `门前 ${y.closed} 番 · ${y.open ? `副露 ${y.open} 番` : '门前限定'}`
})

const valueLabel = computed(() => {
  const y = props.yaku
  if (y.yakuman) {
    return y.yakuman === 2 && state.rules.doubleYakuman ? '双倍役满' : '役满'
  }
  return `${state.closed === false ? y.open : y.closed} 番`
})
</script>
