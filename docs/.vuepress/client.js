import { defineClientConfig, withBase } from 'vuepress/client';
import { onMounted } from 'vue';
import OfflineStatus from './components/OfflineStatus.vue';

export default defineClientConfig({
  enhance({app}) {
    app.component('OfflineStatus', OfflineStatus);
  },
  setup() {
    onMounted(() => {
      if (__VUEPRESS_DEV__ || !window.isSecureContext || !('serviceWorker' in navigator)) return;
      // Do not rely on a lazily imported library waiting for an already-fired load event.
      navigator.serviceWorker.register(withBase('/service-worker.js'))
        .catch(error => console.error('离线缓存注册失败:', error));
    });
  },
});
