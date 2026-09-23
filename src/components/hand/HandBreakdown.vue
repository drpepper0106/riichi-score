<template>
  <section v-if="calc.best" class="panel" id="auto-breakdown">
    <SectionTitle step="算" title="这一手怎么得分" />
    <div class="auto-yaku-list">
      <div v-for="y in calc.best.yaku" :key="y.id">
        <span>{{ y.name }}</span>
        <b>{{ y.value }}{{ calc.best.yakuman ? ' 倍役满' : ' 番' }}</b>
      </div>
      <template v-if="!calc.best.yakuman">
        <div v-for="[n, v] in doraLines" :key="n" class="muted">
          <span>{{ n }}</span><b>{{ v }} 番</b>
        </div>
      </template>
    </div>

    <details open>
      <summary>{{ calc.best.yakuman ? '役满不计算符数' : `为什么是 ${calc.best.fu.value} 符？` }}</summary>
      <p v-if="calc.best.yakuman" class="hint">按役满倍数结算，不叠加普通番符与宝牌。</p>
      <div v-else class="lines">
        <div v-for="([n, v], i) in calc.best.fu.lines" :key="i">
          <span>{{ n }}</span><b>{{ v }} 符</b>
        </div>
        <div class="sum">
          <span>{{ calc.best.fu.raw === calc.best.fu.value ? '最终符数' : `合计 ${calc.best.fu.raw} → 向上取整` }}</span>
          <b>{{ calc.best.fu.value }} 符</b>
        </div>
      </div>
    </details>

    <details>
      <summary>采用的拆分 · {{ calc.best.waitName }}</summary>
      <div class="division-groups">
        <div
          v-for="(g, i) in calc.best.groups"
          :key="i"
          class="division-group"
          :class="{ completed: i === calc.best.winIndex }"
        >
          <MahjongTile v-for="(t, j) in RiichiHand.groupTiles(g)" :key="j" :tile="t" mini />
          <small>{{ g.fixed ? groupName(g) : i === calc.best.winIndex ? '和牌张完成此组' : '' }}</small>
        </div>
      </div>
      <p class="hint">{{ calc.candidates.length > 1 ? `已比较 ${calc.candidates.length} 种合法解释，按实际得点选择。` : '已按完整牌面自动拆分。' }}录入时的手牌分组不会限制计算。</p>
    </details>

    <details v-if="calc.candidates.length > 1">
      <summary>其他合法解释</summary>
      <div
        v-for="a in calc.candidates.slice(1, 9)"
        :key="altKey(a)"
        class="alternative"
      >
        <span>{{ a.yaku.map((y) => y.name).join('、') }} · {{ a.yakuman ? a.payment.tier : `${a.han} 番 ${a.fu.value} 符` }} · {{ a.waitName }}</span>
        <b>{{ fmt(a.payment.baseTotal) }} 点</b>
      </div>
      <p class="hint">此处比较不含本场与立直棒的合计支付；最多展示 8 个其他方案。</p>
    </details>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import RiichiHand from '../../engine/hand.js'
import { fmt, groupName } from '../../utils/helpers.js'
import SectionTitle from '../common/SectionTitle.vue'
import MahjongTile from '../common/MahjongTile.vue'

const props = defineProps({
  hand: { type: Object, required: true },
  calc: { type: Object, required: true },
})

const doraLines = computed(() => [
  ['宝牌', props.hand.dora],
  ['赤宝牌', props.hand.aka],
  ['里宝牌', props.hand.ura],
])

function altKey(a) {
  return `${a.kind}-${a.han}-${a.fu.value}-${a.wait}`
}
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

.muted {
  color: var(--muted);
  font-size: 12px;
}

.auto-yaku-list > div {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #ecf0eb;
}

.division-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.division-group {
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 7px;
}

.division-group.completed {
  border-color: #ba963b;
  background: #fbf7e9;
}

.division-group small {
  display: block;
  font-size: 10px;
  color: var(--muted);
  padding-top: 5px;
  text-align: center;
}

.alternative {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  line-height: 1.7;
  border-bottom: 1px solid var(--line);
  padding: 10px 0;
}

.alternative b {
  white-space: nowrap;
}

details > summary {
  cursor: pointer;
  font-size: 14px;
  min-height: 44px;
  line-height: 1.5;
  padding: 12px 0;
  color: var(--green);
}

.lines {
  padding: 12px 0 0;
}

.lines > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 14px;
  padding: 10px 0;
}

.lines .sum {
  border-top: 1px solid var(--line);
  margin-top: 8px;
  color: var(--green);
  font-weight: 600;
}
</style>
