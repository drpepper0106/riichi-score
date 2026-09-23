<template>
  <section class="panel" id="hand-context">
    <SectionTitle step="03" title="和牌情况" />
    <div class="field">
      <label>怎么和的？</label>
      <ChoiceButtons v-model="hand.method" :options="methodOpts" />
    </div>
    <div class="field">
      <label>我的自风 <small class="muted">东＝庄家</small></label>
      <ChoiceButtons v-model="hand.seat" :options="windOpts" />
    </div>
    <div class="field">
      <label>当前场风</label>
      <ChoiceButtons v-model="hand.round" :options="windOpts" />
    </div>
    <div class="field">
      <label>立直状态</label>
      <ChoiceButtons v-model="hand.riichi" :options="riichiOpts" />
    </div>
    <details>
      <summary>一发、岭上、海底等其他情况{{ hand.events.length ? ` · 已选 ${hand.events.length} 项` : '' }}</summary>
      <div class="event-grid">
        <label v-for="[v, label] in events" :key="v">
          <input
            type="checkbox"
            :checked="hand.events.includes(v)"
            @change="toggleHandEvent(v, $event.target.checked)"
          />
          {{ label }}
        </label>
      </div>
      <p class="hint">这些需要牌局经过判断。仅勾选实际发生的情况，程序会检查已知冲突。</p>
    </details>
  </section>
</template>

<script setup>
import { useAppStore } from '../../composables/useAppStore.js'
import SectionTitle from '../common/SectionTitle.vue'
import ChoiceButtons from '../common/ChoiceButtons.vue'

defineProps({ hand: { type: Object, required: true } })

const { toggleHandEvent } = useAppStore()

const methodOpts = [{ v: 'ron', t: '荣和' }, { v: 'tsumo', t: '自摸' }]
const windOpts = [[27, '东'], [28, '南'], [29, '西'], [30, '北']].map(([v, t]) => ({ v, t }))
const riichiOpts = [
  { v: 'none', t: '未立直' },
  { v: 'riichi', t: '立直' },
  { v: 'doubleRiichi', t: '两立直' },
]
const events = [
  ['ippatsu', '一发'],
  ['rinshan', '岭上开花'],
  ['chankan', '抢杠'],
  ['haitei', '海底摸月'],
  ['houtei', '河底捞鱼'],
  ['tenhou', '天和'],
  ['chiihou', '地和'],
]
</script>
