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

<style scoped>
.yaku-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  padding: 6px 18px 10px;
}

.yaku-card.picked {
  border-color: #5a9282;
  box-shadow: inset 3px 0 0 #2c6b57;
}

.yaku-pick {
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
  padding: 14px 0;
  width: 100%;
  border: 0;
  background: none;
}

.yaku-pick strong {
  font-size: 16px;
}

.yaku-pick small {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-top: 7px;
}

.tick-box {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border: 1px solid #aabeb4;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: white;
}

.picked .tick-box {
  background: var(--green);
  border-color: var(--green);
}

.yaku-value {
  font-size: 15px;
  color: var(--green);
  margin-left: auto;
  white-space: nowrap;
}

.yaku-card p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--muted);
  margin: 0 0 8px;
}

.yaku-card details {
  border-top: 1px solid #eef2ef;
}

.yaku-card details > summary {
  cursor: pointer;
  font-size: 14px;
  min-height: 44px;
  line-height: 1.5;
  padding: 12px 0;
  color: var(--green);
}

.muted {
  color: var(--muted);
  font-size: 12px;
}
</style>
