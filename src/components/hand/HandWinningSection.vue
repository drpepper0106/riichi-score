<template>
  <section class="panel" id="winning-section">
    <SectionTitle step="02" title="最后和的是哪张？" />
    <div v-if="uniqueTiles.length" class="winning-picker">
      <button
        v-for="t in uniqueTiles"
        :key="t"
        type="button"
        class="winning-choice"
        :class="{ 'is-win': hand.winTile === t }"
        :aria-pressed="hand.winTile === t"
        :aria-label="`和牌张${RiichiHand.name(t)}`"
        @click="hand.winTile = t"
      >
        <MahjongTile :tile="t" mini />
        <span v-if="hand.winTile === t" class="win-badge">和</span>
      </button>
    </div>
    <p v-else class="hint">先录入手牌，再从这里点选和牌张。</p>
    <p class="hint">标记已有的一张，不会多加牌。相同牌只需选一次，归属由程序判断。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import RiichiHand from '../../engine/hand.js'
import SectionTitle from '../common/SectionTitle.vue'
import MahjongTile from '../common/MahjongTile.vue'

const props = defineProps({
  hand: { type: Object, required: true },
})

const uniqueTiles = computed(() =>
  [...new Set(
    props.hand.groups
      .filter((g) => !g.open && g.type !== 'quad')
      .flatMap(RiichiHand.groupTiles)
  )].sort((a, b) => a - b)
)
</script>

<style scoped>
.panel {
  background: white;
  padding: 20px 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  margin-bottom: 18px;
}

.hint {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

.winning-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.winning-choice {
  position: relative;
  border: 1px solid transparent;
  background: #f5f7f3;
  padding: 6px;
  min-height: 64px;
}

.winning-choice.is-win {
  background: #e8f0dc;
  border-color: #64804c;
  box-shadow: inset 0 0 0 1px #64804c;
}

.win-badge {
  position: absolute;
  top: -7px;
  right: -4px;
  background: var(--green);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
}
</style>
