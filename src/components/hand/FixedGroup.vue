<template>
  <div
    class="fixed-group"
    :class="{ editing: builder.edit === index }"
  >
    <button type="button" @click="$emit('edit', index)">
      <span class="group-tiles">
        <MahjongTile v-for="(t, i) in tiles" :key="i" :tile="t" mini />
      </span>
      <span class="group-foot">{{ name }} · 点此修改</span>
    </button>
    <button type="button" class="remove-group" :aria-label="`删除${name}`" @click="$emit('remove', index)">×</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import RiichiHand from '../../engine/hand.js'
import MahjongTile from '../common/MahjongTile.vue'
import { groupName } from '../../utils/helpers.js'

const props = defineProps({
  group: { type: Object, required: true },
  index: { type: Number, required: true },
  builder: { type: Object, required: true },
})

defineEmits(['edit', 'remove'])

const tiles = computed(() => RiichiHand.groupTiles(props.group))
const name = computed(() => groupName(props.group))
</script>

<style scoped>
.fixed-group {
  display: inline-flex;
  align-items: center;
  border: 1px solid #cdd9cb;
  border-radius: 9px;
  background: white;
  padding: 4px;
  margin: 4px 5px 0 0;
  max-width: 100%;
}

.fixed-group.editing {
  border-color: #ba963b;
  box-shadow: 0 0 0 1px #ba963b;
}

.fixed-group > button {
  border: 0;
  background: transparent;
  padding: 2px;
}

.fixed-group > .remove-group {
  font-size: 19px;
  width: 28px;
  padding: 0;
  color: #8d5146;
}

.group-tiles {
  display: flex;
  gap: 2px;
}

.group-foot {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  margin-top: 5px;
  color: var(--muted);
}

.group-foot > span {
  color: var(--green);
}

.fixed-group .group-foot {
  justify-content: center;
}

.fixed-group :deep(.mahjong-tile.mini) {
  width: 29px;
  height: 46px;
}
</style>
