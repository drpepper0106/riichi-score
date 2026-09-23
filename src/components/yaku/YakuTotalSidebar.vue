<template>
  <aside class="panel yaku-total" id="yaku-total">
    <SectionTitle step="＋" title="已选役种" />
    <div class="selected-summary">
      <button
        v-for="y in selected"
        :key="y.id"
        type="button"
        class="chip"
        @click="selectYaku(y.id)"
      >{{ y.name }} ×</button>
      <span v-if="!selected.length" class="hint">还没有选择，点选左侧或上方的役种。</span>
    </div>
    <button class="text-button" type="button" @click="clearYaku">清空选择</button>

    <template v-if="!yc.yakuman">
      <hr />
      <CounterInput v-model="state.dora" label="宝牌" :max="40" />
      <CounterInput v-model="state.aka" label="赤宝牌" :max="4" />
      <CounterInput v-model="state.ura" label="里宝牌" :max="40" />
      <p class="hint">填写实际宝牌张数，杠宝牌并入宝牌；里宝牌需立直。</p>
    </template>
    <p v-else class="note">真实役满计分时，普通役和宝牌不再叠加。</p>

    <div class="yaku-sum">
      <span>当前合计</span>
      <b>{{ yc.yakuman ? `${yc.yakuman} 倍役满` : `${yc.han} 番` }}</b>
    </div>
    <div v-if="yc.errors.length" class="inline-error">
      <template v-for="(err, i) in yc.errors" :key="i">{{ err }}<br v-if="i < yc.errors.length - 1" /></template>
    </div>
    <button class="primary full" type="button" :disabled="!yc.selected.length" @click="applyYaku">
      {{ yc.yakuman ? '使用此役满' : '使用此番数' }} →
    </button>
    <p class="hint">按门前番数分组；副露减番已自动处理。具体牌面和成立条件请自行核对。</p>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import SectionTitle from '../common/SectionTitle.vue'
import CounterInput from '../common/CounterInput.vue'

const { state, Riichi, selectYaku, applyYaku } = useAppStore()

const selected = computed(() => Riichi.YAKU.filter((y) => state.yaku.includes(y.id)))
const yc = computed(() => Riichi.yakuCount(state))

function clearYaku() {
  state.yaku = []
  state.dora = 0
  state.aka = 0
  state.ura = 0
}
</script>
