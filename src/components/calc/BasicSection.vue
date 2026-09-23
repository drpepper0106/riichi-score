<template>
  <section class="panel" id="basic-section">
    <SectionTitle step="01" title="基本情况" />
    <p class="hint">从这手牌怎么和开始</p>
    <div class="basic-grid">
      <div class="field">
        <label>我的身份</label>
        <ChoiceButtons v-model="state.dealer" :options="dealerOpts" />
      </div>
      <div class="field">
        <label>和牌方式</label>
        <ChoiceButtons v-model="state.win" :options="winOpts" />
      </div>
    </div>
    <template v-if="state.kind !== 'yakuman' || state.hanMode === 'yaku'">
      <div class="field">
        <label>门前状态</label>
        <ChoiceButtons v-model="state.closed" :options="closedOpts" />
        <p class="hint">没有吃、碰、明杠就是门前清，暗杠不影响。</p>
      </div>
      <div v-if="state.fuMode === 'guided' && state.kind !== 'yakuman'" class="field">
        <label>手牌结构</label>
        <ChoiceButtons v-model="state.kind" :options="kindOpts" />
      </div>
    </template>
    <p v-else class="note">暗杠不破坏门前清。</p>
  </section>
</template>

<script setup>
import { useAppStore } from '../../composables/useAppStore.js'
import SectionTitle from '../common/SectionTitle.vue'
import ChoiceButtons from '../common/ChoiceButtons.vue'

const { state } = useAppStore()

const dealerOpts = [{ v: false, t: '闲家' }, { v: true, t: '庄家' }]
const winOpts = [{ v: 'ron', t: '荣和' }, { v: 'tsumo', t: '自摸' }]
const closedOpts = [{ v: true, t: '门前清' }, { v: false, t: '有副露' }]
const kindOpts = [
  { v: 'normal', t: '普通牌型', sub: '四组面子＋雀头' },
  { v: 'seven', t: '七对子', sub: '七组不同对子' },
]
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

.note {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
  padding: 12px 14px;
  background: var(--bg);
  border-radius: 10px;
}

.field {
  margin: 20px 0;
}

.field > label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.basic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.basic-grid .field {
  margin: 0;
}

.head-value {
  margin-left: auto;
  color: var(--green);
  font-size: 16px;
  font-weight: 700;
}

.basic-grid :deep(.choices button) {
  min-width: 50px;
}
</style>
