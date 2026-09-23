<template>
  <section class="panel" id="fu-section">
    <SectionTitle step="02" title="这手牌有多少符？">
      <span v-if="evaluation.fu.value && !evaluation.fu.errors.length" class="head-value">{{ evaluation.fu.value }} 符</span>
    </SectionTitle>

    <ChoiceButtons v-model="state.fuMode" :options="modeOpts" />

    <template v-if="state.fuMode === 'direct'">
      <p class="hint">已经知道符数，直接选就好。</p>
      <ChoiceButtons v-model="state.directFu" :options="fuOpts" grid-class="grid" />
    </template>

    <div v-else-if="state.kind === 'seven'" class="special">
      <b>25 <small>符</small></b>
      <p>七对子固定 25 符<br>不加自摸、单骑或荣和符，也不进位。</p>
    </div>

    <template v-else>
      <p class="hint">普通牌型从 20 底符开始；门前荣和＋10 符，自摸＋2 符（平和自摸固定 20 符）。</p>
      <div class="field">
        <label>雀头是什么？</label>
        <ChoiceButtons v-model="state.pair" :options="pairOpts" :fu-label="pairFu" />
      </div>
      <template v-if="state.pair === 'wind'">
        <div class="checks">
          <label>
            <input v-model="state.seat" type="checkbox" />
            是我的自风 <span class="option-fu">单独成立＋2 符</span>
          </label>
          <label>
            <input v-model="state.round" type="checkbox" />
            是当前场风 <span class="option-fu">单独成立＋2 符</span>
          </label>
        </div>
        <p class="hint">东场南家：东是场风，南是自风。两者都不是＋0 符；同时成立按当前规则共＋{{ state.rules.doubleWind }} 符。</p>
      </template>
      <div class="field">
        <label>和的这张牌是怎么得到的？</label>
        <ChoiceButtons v-model="state.wait" :options="waitOpts" grid-class="grid" :fu-label="waitFu" />
      </div>
      <details>
        <summary>听牌方式拿不准？</summary>
        <p class="hint">按本次和牌张在当前拆分中的作用选择，不看牌山里还剩几张。双碰听牌本身＋0 符，完成的刻子在面子中另计。23 和 1 是两面，不是边张。多种拆分都成立时，请分别尝试。</p>
        <TileExample :example="waitExample" />
      </details>
      <div class="row-heading">
        <h3>四组面子</h3>
        <button class="text-button" type="button" @click="fillSeqMelds">其余均为顺子</button>
      </div>
      <p class="hint">每组面子只加一次符。下方标注为整组符数，不要将组型、牌类、组成方式的标注重复相加；条件未选齐时显示范围。</p>
      <MeldEditor v-for="(m, i) in state.melds" :key="i" :meld="m" :index="i" />
    </template>

    <div v-if="evaluation.fu.errors.length" class="inline-error">
      <template v-for="(err, i) in evaluation.fu.errors" :key="i">{{ err }}<br v-if="i < evaluation.fu.errors.length - 1" /></template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import SectionTitle from '../common/SectionTitle.vue'
import ChoiceButtons from '../common/ChoiceButtons.vue'
import TileExample from '../common/TileExample.vue'
import MeldEditor from './MeldEditor.vue'
import { optionFu } from '../../utils/optionFu.js'

defineProps({ evaluation: { type: Object, required: true } })

const { state, Riichi, fillSeqMelds } = useAppStore()

const modeOpts = [{ v: 'guided', t: '帮我算符' }, { v: 'direct', t: '直接选符' }]
const fuOpts = Riichi.FUS.map((n) => ({ v: n, t: `${n} 符` }))
const pairOpts = [
  { v: 'number', t: '数牌', sub: '万 / 筒 / 索' },
  { v: 'dragon', t: '白 / 发 / 中' },
  { v: 'wind', t: '风牌', sub: '东 / 南 / 西 / 北' },
]
const waitOpts = [
  { v: 'ryanmen', t: '两面', sub: '45 等 3 / 6' },
  { v: 'shanpon', t: '双碰', sub: '33、77 等 3 / 7' },
  { v: 'kanchan', t: '嵌张', sub: '46 等 5' },
  { v: 'penchan', t: '边张', sub: '12 等 3；89 等 7' },
  { v: 'tanki', t: '单骑', sub: '单张等另一张成对' },
]

const waitExample = computed(() => ({
  kanchan: '4m 6m 5m',
  penchan: '1m 2m 3m',
  shanpon: '33m 77p',
  tanki: '5m 5m',
  ryanmen: '4m 5m 3m 6m',
}[state.wait] || '4m 5m 3m 6m'))

const pairFu = (v) => optionFu('pair', v, state.rules)
const waitFu = (v) => optionFu('wait', v, state.rules)
</script>
