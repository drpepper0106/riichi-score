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
