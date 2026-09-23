<template>
  <div v-if="example" class="tiles" :aria-label="example">
    <MahjongTile v-for="(t, i) in tiles" :key="i" :tile="t" mini />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MahjongTile from './MahjongTile.vue'
import { parseTileExample } from '../../utils/tiles.js'

const props = defineProps({
  example: { type: String, default: '' },
})

const tiles = computed(() => parseTileExample(props.example))
</script>
