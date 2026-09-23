<template>
  <span
    :class="['mahjong-tile', `suit-${suit}`, { mini }]"
    :aria-label="name"
  >
    <span v-html="face" />
    <span class="tile-caption">{{ name }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import RiichiHand from '../../engine/hand.js'
import { tileFace } from '../../utils/tiles.js'

const props = defineProps({
  tile: { type: Number, required: true },
  mini: { type: Boolean, default: false },
})

const suit = computed(() => (props.tile < 27 ? Math.floor(props.tile / 9) : 3))
const name = computed(() => RiichiHand.name(props.tile))
const face = computed(() => tileFace(props.tile))
</script>
