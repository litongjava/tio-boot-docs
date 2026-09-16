<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { withBase } from 'vuepress/client';

const state = ref('preparing');
const message = ref('正在检查离线资源…');
const detail = ref('');
const busy = ref(false);
const hasUpdate = ref(false);
const downloadBusy = ref(false);
const downloadMessage = ref('');
let timer;
const onNetworkChange = () => check();

async function check(retry = false) {
  if (busy.value) return;
  busy.value = true;
  try {
    if (!window.isSecureContext || !('serviceWorker' in navigator) || !('caches' in window)) {
      state.value = 'unsupported';
      message.value = '此环境未启用离线缓存';
      detail.value = '请使用支持 Service Worker 的浏览器，通过 HTTPS 或 localhost 访问。也可以下载下方语料文件离线使用。';
      return;
    }
    const registration = await navigator.serviceWorker.getRegistration(withBase('/'));
    hasUpdate.value = Boolean(registration?.waiting);
    if (retry && navigator.onLine) {
      if (registration) await registration.update();
      else await navigator.serviceWorker.register(withBase('/service-worker.js'));
    }
    const response = await fetch(withBase('/offline-manifest.json'));
    if (!response.ok) throw new Error('离线清单尚未发布或下载失败');
    const manifest = await response.json();
    const size = (manifest.totalBytes / 1024 / 1024).toFixed(1);
    detail.value = `首次准备约需下载 ${size} MB，请保持此页面打开。`;
    if (!navigator.serviceWorker.controller) {
      state.value = 'preparing';
      message.value = '正在下载离线资源';
      return;
    }
    const requests = (await Promise.all((await caches.keys()).map(async name =>
      (await caches.open(name)).keys()))).flat();
    const cachedUrls = new Set(requests.map(request => request.url));
    const base = new URL(withBase('/'), location.origin);
    const missing = manifest.resources.filter(resource => {
      const url = new URL(resource.url, base);
      if (resource.revision) url.searchParams.set('__WB_REVISION__', resource.revision);
      return !cachedUrls.has(url.href);
    });
    // The manifest itself must be saved, not just returned by an online server.
    const manifestPath = new URL(withBase('/offline-manifest.json'), location.origin).pathname;
    let manifestSaved = false;
    for (const request of requests.filter(request => new URL(request.url).pathname === manifestPath)) {
      const saved = await caches.match(request);
      if (saved && (await saved.json()).version === manifest.version) manifestSaved = true;
    }
    if (missing.length || !manifestSaved) {
      if (retry && navigator.onLine && registration?.active && !registration.installing && !registration.waiting) {
        // A normal update does not reinstall unchanged SW code after cache eviction.
        // A distinct script URL forces installation while keeping the active worker.
        await navigator.serviceWorker.register(`${withBase('/service-worker.js')}?repair=${Date.now()}`);
        state.value = 'preparing';
        message.value = '正在补全离线资源';
        return;
      }
      state.value = 'incomplete';
      message.value = '离线资源尚未完整保存';
      detail.value = `尚缺 ${missing.length + Number(!manifestSaved)} 项资源。保持联网等待下载；若长时间未完成，可重试或检查浏览器存储空间。`;
    } else {
      state.value = 'ready';
      message.value = '离线已就绪：站内搜索与 AI 语料可用';
      detail.value = `已保存 ${manifest.resources.length} 项资源（${size} MB），版本 ${manifest.version}。${registration?.waiting ? '新版本已下载，可点击下方按钮应用更新。' : '现在可以断网使用。'}`;
    }
  } catch (error) {
    state.value = 'error';
    message.value = '尚未确认离线可用';
    detail.value = `${error.message}。请联网后重试；在显示“离线已就绪”之前不要依赖离线缓存。`;
  } finally {
    busy.value = false;
  }
}

async function applyUpdate() {
  const registration = await navigator.serviceWorker.getRegistration(withBase('/'));
  if (!registration?.waiting) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), {once:true});
  registration.waiting.postMessage({type:'SKIP_WAITING'});
}

async function downloadCorpus(event) {
  event.preventDefault();
  if (downloadBusy.value) return;
  const {href, download} = event.currentTarget;
  downloadBusy.value = true;
  downloadMessage.value = '正在读取已保存的语料…';
  try {
    // Native <a download> may bypass SW in offline mode. Fetch uses the precache,
    // and the resulting blob is saved locally without another network request.
    const response = await fetch(href);
    if (!response.ok) throw new Error(`读取失败（${response.status}）`);
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = download;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    downloadMessage.value = '文件已准备好，请在浏览器下载列表查看。';
  } catch (error) {
    downloadMessage.value = `下载未完成：${error.message}。请检查离线准备状态或联网后重试。`;
    check();
  } finally {
    downloadBusy.value = false;
  }
}

onMounted(() => {
  check();
  timer = setInterval(() => check(), 5000);
  window.addEventListener('online', onNetworkChange);
  window.addEventListener('offline', onNetworkChange);
});
onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener('online', onNetworkChange);
  window.removeEventListener('offline', onNetworkChange);
});
</script>

<template>
  <section class="offline-status" :data-offline-state="state" aria-label="离线可用状态">
    <p role="status"><strong>{{ message }}</strong></p>
    <p>{{ detail }}</p>
    <button type="button" :disabled="busy" @click="check(true)">检查状态 / 重试下载</button>
    <button v-if="hasUpdate" type="button" @click="applyUpdate">应用已下载的更新</button>
    <p class="offline-downloads">
      <a :href="withBase('/ai/chunks.jsonl')" download="tio-boot-ai-corpus.jsonl" :aria-disabled="downloadBusy" @click="downloadCorpus">下载完整 AI 语料</a>
      <a :href="withBase('/ai/index.json')" download="tio-boot-ai-index.json" :aria-disabled="downloadBusy" @click="downloadCorpus">下载检索目录</a>
      <a :href="withBase('/llms-full.txt')" download="tio-boot-llms-full.txt" :aria-disabled="downloadBusy" @click="downloadCorpus">下载完整文档</a>
    </p>
    <p v-if="downloadMessage" role="status">{{ downloadMessage }}</p>
  </section>
</template>

<style scoped>
.offline-status { border: 1px solid var(--vp-c-border, #aaa); border-radius: 8px; padding: 1rem 1.25rem; margin: 1.5rem 0; }
.offline-status[data-offline-state="ready"] { border-color: #299764; }
.offline-status button { border: 1px solid currentColor; border-radius: 5px; padding: .5rem .75rem; color: inherit; background: transparent; cursor: pointer; }
.offline-status button:disabled { opacity: .5; cursor: wait; }
.offline-downloads { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; }
</style>
