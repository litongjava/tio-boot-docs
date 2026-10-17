<script setup>
import { ref, watch } from 'vue';
import { usePageData, withBase } from 'vuepress/client';

const page = usePageData();
const state = ref('idle');
let generation = 0;
watch(() => page.value.path, () => { generation++; state.value = 'idle'; });

async function copyMarkdown() {
  const current = generation;
  state.value = 'loading';
  try {
    const response = await fetch(withBase(page.value.markdownUrl));
    if (!response.ok || /text\/html/i.test(response.headers.get('content-type') || '')) {
      throw new Error('Markdown unavailable');
    }
    const text = (await response.text()).replace(/^<!-- Source: .* -->\r?\n\r?\n/, '');
    if (current !== generation) return;
    await navigator.clipboard.writeText(text);
    if (current === generation) state.value = 'success';
  } catch {
    if (current === generation) state.value = 'error';
  }
}
</script>

<template>
  <div v-if="page.markdownUrl && !page.frontmatter.home" class="copy-markdown">
    <button type="button" :disabled="state === 'loading'" @click="copyMarkdown">
      {{ state === 'loading' ? '正在复制…' : state === 'success' ? '已复制 Markdown' : '复制 Markdown' }}
    </button>
    <span role="status" aria-live="polite">
      <template v-if="state === 'success'">已复制到剪贴板</template>
      <template v-else-if="state === 'error'">
        复制失败，请重试或<a :href="withBase(page.markdownUrl)" target="_blank" rel="noopener">打开 Markdown 手动复制</a>
      </template>
    </span>
  </div>
</template>

<style scoped>
.copy-markdown { display: flex; justify-content: flex-end; align-items: center; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; font-size: .875rem; }
button { padding: .4rem .8rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text); font: inherit; cursor: pointer; }
button:hover { border-color: var(--vp-c-accent); color: var(--vp-c-accent); }
button:focus-visible { outline: 2px solid var(--vp-c-accent); outline-offset: 2px; }
button:disabled { cursor: wait; opacity: .65; }
</style>
