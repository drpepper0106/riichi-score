<template>
  <section class="panel" id="hand-dora">
    <SectionTitle step="04" title="最后，填宝牌数量" />
    <CounterInput v-model="hand.dora" label="宝牌（含杠宝牌）" :max="72" />
    <CounterInput v-model="hand.aka" label="赤宝牌" :max="4" />
    <CounterInput v-model="hand.ura" label="里宝牌（含杠里宝牌）" :max="72" />
    <p class="hint">不录指示牌，赤五在牌面中当普通五录入。三项分别填写，不要重复包含；同一张赤五同时是宝牌时，两项各计 1。里宝牌需要立直。</p>
  </section>

  <details class="panel">
    <summary>本场与桌上立直棒 <small>{{ hand.honba }} 本场 · {{ hand.sticks }} 根</small></summary>
    <CounterInput v-model="hand.honba" label="本场数" />
    <CounterInput v-model="hand.sticks" label="桌上立直棒" />
    <p class="hint">每本场荣和加 300 点、自摸每家加 100 点；立直棒每根 1,000 点。</p>
  </details>
</template>

<script setup>
import SectionTitle from '../common/SectionTitle.vue'
import CounterInput from '../common/CounterInput.vue'

defineProps({ hand: { type: Object, required: true } })
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

details > summary {
  cursor: pointer;
  font-size: 14px;
  min-height: 44px;
  line-height: 1.5;
  padding: 12px 0;
  color: var(--green);
}

details.panel > summary {
  font-weight: 600;
  font-size: 16px;
  display: list-item;
}

summary > small {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
  margin-left: 8px;
}
</style>
