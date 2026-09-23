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
