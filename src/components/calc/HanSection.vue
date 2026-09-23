<template>
  <section class="panel" id="han-section">
    <SectionTitle step="03" :title="state.kind === 'yakuman' ? '役满倍数' : '番数是多少？'" />
    <div class="mode-line">
      <span class="hint">{{ state.hanMode === 'yaku' ? '按已选役种计番' : '手动输入' }}</span>
      <button class="text-button" type="button" @click="switchTab('yaku')">参考役种 →</button>
    </div>

    <template v-if="state.hanMode === 'yaku'">
      <div class="selected-summary">
        <span v-for="y in evaluation.yaku?.selected || []" :key="y.id" class="chip">{{ y.name }}</span>
        <span v-if="!(evaluation.yaku?.selected || []).length" class="hint">尚未选择役种</span>
      </div>
      <p class="hint">{{ evaluation.yakuman ? `${evaluation.yakuman} 倍役满` : `${evaluation.han} 番，含宝牌` }} · 修改役种会同步更新</p>
      <button class="quiet" type="button" @click="state.hanMode = 'manual'; state.han = Riichi.yakuCount(state).han || null">改为手动输入</button>
    </template>

    <template v-else-if="state.kind === 'yakuman'">
      <ChoiceButtons v-model="state.yakuman" :options="yakumanOpts" grid-class="grid" />
    </template>

    <template v-else>
      <label class="field-label">总番数，包含宝牌</label>
      <div class="han-choices">
        <button
          v-for="n in [1, 2, 3, 4, 5, 6, 7]"
          :key="n"
          type="button"
          :class="{ selected: state.han === n }"
          :aria-pressed="state.han === n"
          @click="state.han = n"
        >{{ n }}</button>
        <button type="button" :class="{ selected: state.han >= 8 && state.han <= 12 }" @click="state.expandedHan = !state.expandedHan">8～12</button>
        <button type="button" :class="{ selected: state.han === 13 }" @click="state.han = 13">13＋</button>
      </div>
      <ChoiceButtons
        v-if="state.expandedHan || (state.han >= 8 && state.han <= 12)"
        v-model="state.han"
        :options="[8, 9, 10, 11, 12].map((n) => ({ v: n, t: `${n} 番` }))"
      />
      <p class="hint">请确认至少有一个役；宝牌本身不能作为和牌的役。</p>
    </template>

    <button class="text-button yakuman-entry" type="button" @click="toggleYakuman">
      {{ state.kind === 'yakuman' ? '← 返回普通计分' : '这手是役满？进入役满结算' }}
    </button>
  </section>
</template>

<script setup>
import { useAppStore } from '../../composables/useAppStore.js'
import SectionTitle from '../common/SectionTitle.vue'
import ChoiceButtons from '../common/ChoiceButtons.vue'

defineProps({ evaluation: { type: Object, required: true } })

const { state, Riichi, switchTab } = useAppStore()

const yakumanOpts = [1, 2, 3, 4, 5, 6].map((n) => ({
  v: n,
  t: n === 1 ? '单倍役满' : `${n} 倍役满`,
}))

function toggleYakuman() {
  state.kind = state.kind === 'yakuman' ? 'normal' : 'yakuman'
  state.hanMode = 'manual'
}
</script>
