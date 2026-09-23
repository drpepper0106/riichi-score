<template>
  <span class="eyebrow">RULE SETTINGS</span>
  <h2>按你的牌桌规则</h2>
  <p class="hint">修改后立即重算，设置保存在本机。</p>

  <div class="field">
    <label>连风雀头</label>
    <ChoiceButtons v-model="state.rules.doubleWind" :options="windFuOpts" />
  </div>

  <label v-for="item in toggles" :key="item.key" class="setting-row">
    <span>
      <b>{{ item.title }}</b>
      <small>{{ item.desc }}</small>
    </span>
    <input v-model="state.rules[item.key]" type="checkbox" role="switch" />
  </label>

  <p class="note">兼容的真实役满可以叠加。暂不处理包牌、三人麻将和多家和牌。</p>
  <button class="quiet" type="button" @click="$emit('default-rules')">恢复默认规则</button>
</template>

<script setup>
import { useAppStore } from '../../composables/useAppStore.js'
import ChoiceButtons from '../common/ChoiceButtons.vue'

defineEmits(['default-rules'])

const { state } = useAppStore()

const windFuOpts = [{ v: 4, t: '4 符' }, { v: 2, t: '2 符' }]

const toggles = [
  { key: 'kiriage', title: '切上满贯', desc: '4 番 30 符、3 番 60 符按满贯' },
  { key: 'kazoe', title: '累计役满', desc: '13 番以上按役满；关闭则按三倍满' },
  { key: 'kuitan', title: '允许副露断幺九（食断）', desc: '吃、碰后，断幺九仍可作为 1 番役' },
  { key: 'doubleYakuman', title: '特殊双倍役满', desc: '国士十三面、四暗刻单骑、纯正九莲、大四喜' },
]
</script>
