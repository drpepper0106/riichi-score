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

<style scoped>
.mahjong-tile {
  width: 44px;
  height: 65px;
  display: inline-flex;
  flex: none;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  vertical-align: middle;
  background: linear-gradient(135deg, #fffef7, #fff);
  border: 1px solid #c8d1c6;
  border-bottom: 4px solid #bbccbb;
  border-radius: 5px;
  padding: 4px 4px 13px;
  box-shadow: 0 2px 2px #1935270a;
  user-select: none;
}

.mahjong-tile.mini {
  width: 30px;
  height: 48px;
  padding: 3px 3px 11px;
  border-bottom-width: 3px;
}

.tile-caption {
  font-size: 9px;
  line-height: 1;
  position: absolute;
  bottom: 3px;
  left: 0;
  right: 0;
  text-align: center;
  white-space: nowrap;
  color: #60756b;
}

.mini .tile-caption {
  font-size: 8px;
  bottom: 2px;
}

:deep(.tile-art) {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

:deep(.wan-number),
:deep(.wan-mark) {
  font-family: serif;
  font-size: 20px;
  line-height: 1.05;
  color: #a4342d;
}

.mini :deep(.wan-number),
.mini :deep(.wan-mark) {
  font-size: 16px;
}

:deep(.pip-grid),
:deep(.bamboo-grid) {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  gap: 2px;
  align-items: center;
  justify-items: center;
}

:deep(.pip) {
  width: 8px;
  height: 8px;
  border: 2px solid #344e89;
  border-radius: 50%;
  background: #e2ebf9;
}

:deep(.pip.center) {
  border-color: #a44339;
  background: #f8e7dc;
}

.mini :deep(.pip) {
  width: 6px;
  height: 6px;
  border-width: 1.5px;
}

:deep(.empty) {
  visibility: hidden;
}

:deep(.bamboo) {
  width: 5px;
  height: 10px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #277654 0 38%, #a1c591 38% 56%, #277654 56%);
  border: 1px solid #276744;
}

.mini :deep(.bamboo) {
  width: 4px;
  height: 8px;
}

:deep(.honor-character) {
  font-family: serif;
  font-size: 30px;
  color: #283b38;
}

.mini :deep(.honor-character) {
  font-size: 25px;
}

:deep(.honor-character.green) {
  color: #237449;
}

:deep(.honor-character.red) {
  color: #af3930;
}

:deep(.white-dragon) {
  width: 25px;
  height: 31px;
  border: 2px solid #4b70a0;
  border-radius: 2px;
  box-shadow: inset 0 0 0 2px white, inset 0 0 0 3px #b7c9df;
}

.mini :deep(.white-dragon) {
  width: 20px;
  height: 25px;
}
</style>
