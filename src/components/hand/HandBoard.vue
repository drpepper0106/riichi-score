<template>
  <section class="panel hand-board" id="hand-board">
    <SectionTitle step="01" title="录入和牌后的牌面">
      <span class="head-value">{{ calc.total }} / {{ calc.target }}</span>
    </SectionTitle>

    <div class="hand-zone">
      <div class="zone-title">
        <b>手牌区</b><span>已含和牌张 · 点牌删除一张</span>
      </div>
      <div class="loose-tiles">
        <button
          v-for="({ tile, index }, i) in loose"
          :key="`${index}-${tile}-${i}`"
          type="button"
          :aria-label="`删除一张${RiichiHand.name(tile)}`"
          @click="$emit('remove-tile', index, tile)"
        >
          <MahjongTile :tile="tile" mini />
        </button>
        <div v-if="!loose.length" class="empty-zone">对照手里的牌，逐张点选下方牌库</div>
      </div>
      <FixedGroup
        v-for="(g, i) in concealedQuads"
        :key="`q-${i}`"
        :group="g.group"
        :index="g.index"
        :builder="builder"
        @edit="$emit('edit-group', $event)"
        @remove="$emit('remove-group', $event)"
      />
    </div>

    <div class="hand-zone open-zone">
      <div class="zone-title">
        <b>副露区</b><span>按实际的吃、碰、杠保留分组</span>
      </div>
      <div class="hand-groups">
        <FixedGroup
          v-for="(g, i) in openGroups"
          :key="`o-${i}`"
          :group="g.group"
          :index="g.index"
          :builder="builder"
          @edit="$emit('edit-group', $event)"
          @remove="$emit('remove-group', $event)"
        />
        <div v-if="!openGroups.length" class="empty-zone compact">暂无副露</div>
      </div>
    </div>

    <HandEntryPad
      :builder="builder"
      :counts="calc.counts"
      :calc="calc"
      :can-add="canAdd"
      @pick="$emit('pick', $event)"
      @undo="$emit('undo')"
    />

    <div class="board-footer">
      <button class="text-button" type="button" @click="$emit('orphans')">国士牌面快捷填充</button>
    </div>

    <div v-if="calc.errors.length" class="inline-error">
      <template v-for="(err, i) in calc.errors" :key="i">{{ err }}<br v-if="i < calc.errors.length - 1" /></template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import RiichiHand from '../../engine/hand.js'
import { looseTiles } from '../../utils/tiles.js'
import SectionTitle from '../common/SectionTitle.vue'
import MahjongTile from '../common/MahjongTile.vue'
import FixedGroup from './FixedGroup.vue'
import HandEntryPad from './HandEntryPad.vue'

const props = defineProps({
  hand: { type: Object, required: true },
  builder: { type: Object, required: true },
  calc: { type: Object, required: true },
  canAdd: { type: Function, required: true },
})

defineEmits(['pick', 'remove-tile', 'edit-group', 'remove-group', 'undo', 'orphans'])

const loose = computed(() => looseTiles(props.hand))

const concealedQuads = computed(() =>
  props.hand.groups
    .map((g, index) => ({ g, index }))
    .filter(({ g }) => !g.open && g.type === 'quad')
    .map(({ g, index }) => ({ group: g, index }))
)

const openGroups = computed(() =>
  props.hand.groups
    .map((g, index) => ({ g, index }))
    .filter(({ g }) => g.open)
    .map(({ g, index }) => ({ group: g, index }))
)
</script>
