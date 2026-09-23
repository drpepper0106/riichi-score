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
