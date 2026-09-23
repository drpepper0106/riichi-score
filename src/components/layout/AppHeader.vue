<template>
  <header>
    <div class="brand">
      <span class="brand-mark">發</span>
      <div>
        <h1>日麻算点助手</h1>
        <span class="eyebrow">RIICHI · SCORE COMPANION</span>
      </div>
    </div>
    <button class="quiet" aria-label="规则设置" @click="$emit('open-settings')">
      ⚙ <span>规则</span>
    </button>
  </header>
</template>

<script setup>
defineEmits(['open-settings'])
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 20px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-mark {
  display: grid;
  place-items: center;
  background: var(--green);
  color: white;
  width: 39px;
  height: 44px;
  border-radius: 10px;
  font-family: serif;
  font-size: 27px;
  border-bottom: 4px solid #0c332e;
}

h1 {
  font-size: 18px;
  letter-spacing: 0.03em;
  margin: 0 0 4px;
}

.eyebrow {
  font-size: 10px;
  letter-spacing: 0.13em;
  color: var(--muted);
}

.quiet {
  background: transparent;
  border: 0;
  color: var(--muted);
}
</style>
