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

<style scoped>
.panel {
  background: white;
  padding: 20px 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  margin-bottom: 18px;
}

.hand-board {
  padding: 14px 10px;
}

.head-value {
  margin-left: auto;
  color: var(--green);
  font-size: 16px;
  font-weight: 700;
}

.hand-zone {
  border: 1px solid var(--line);
  background: #f8faf8;
  border-radius: 12px;
  padding: 8px;
  margin: 12px 0;
}

.open-zone {
  background: #f2f5ed;
}

.zone-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--muted);
  margin-bottom: 10px;
}

.zone-title b {
  color: var(--ink);
  font-size: 14px;
}

.loose-tiles {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 2px;
  row-gap: 4px;
  min-height: 106px;
  align-content: start;
}

.loose-tiles > button {
  padding: 0;
  border: 0;
  background: none;
  min-width: 0;
  min-height: 49px;
  display: flex;
  justify-content: center;
}

.loose-tiles :deep(.mahjong-tile) {
  width: 30px;
  height: 48px;
  padding: 3px 2px 11px;
  border-bottom-width: 2px;
  border-radius: 3px;
}

.loose-tiles .empty-zone {
  grid-column: 1 / -1;
  padding: 16px 0;
}

.loose-tiles > button:hover {
  background: #f3ded1;
}

.empty-zone {
  font-size: 13px;
  color: #83948b;
  padding: 14px 0;
}

.empty-zone.compact {
  padding: 4px 0;
}

.hand-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.text-button {
  border: 0;
  background: none;
  color: var(--green);
  font-size: 13px;
  padding: 8px 4px;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.board-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.inline-error {
  color: var(--red);
  font-size: 13px;
  line-height: 1.8;
  background: #fff1ec;
  padding: 12px;
  border-radius: 10px;
  margin: 14px 0;
}

.hand-board :deep(.section-title h2) {
  font-size: 17px;
}

.hand-board :deep(.section-title) {
  gap: 8px;
  margin-bottom: 10px;
}

.hand-board .hand-zone {
  margin: 9px 0;
}

.hand-board .zone-title {
  margin-bottom: 6px;
}

.hand-board .zone-title span {
  font-size: 10px;
}

.hand-board .open-zone .empty-zone {
  font-size: 12px;
}

.hand-board .hand-groups {
  gap: 3px;
}

.hand-board .board-footer {
  margin-top: 4px;
}

.hand-board .board-footer .text-button {
  font-size: 12px;
}

:deep(.pad-heading h3) {
  font-size: 15px;
}

:deep(.pad-instruction) {
  font-size: 12px;
}

.loose-tiles :deep(.tile-caption) {
  font-size: 8px;
}
</style>
