/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "e2b4398a14e83ad115f54555f69f0768"
  },
  {
    "url": "about/index.html",
    "revision": "faf83d1a38d1dd2040a06e51a1752acf"
  },
  {
    "url": "assets/css/0.styles.cb82027b.css",
    "revision": "80eb92bb130cb794120698bac651199b"
  },
  {
    "url": "assets/img/search.237d6f6a.svg",
    "revision": "237d6f6a3fe211d00a61e871a263e9fe"
  },
  {
    "url": "assets/js/1.4c91522e.js",
    "revision": "c01ea2a21057c0a39f71161b0c833de8"
  },
  {
    "url": "assets/js/11.15d6815e.js",
    "revision": "6417c2b63b65b34818c93004c52b6a87"
  },
  {
    "url": "assets/js/12.9559a75e.js",
    "revision": "9c1086acc5a983b9f8be4ac6b4251e9c"
  },
  {
    "url": "assets/js/13.a546f7af.js",
    "revision": "1bb64e85779ff23d4276c5ee03e6e786"
  },
  {
    "url": "assets/js/14.3eec96df.js",
    "revision": "384fe6dc74126f6d438b45258f75dec4"
  },
  {
    "url": "assets/js/15.d423265b.js",
    "revision": "b3421621e5ea60d448315f0cdaa07030"
  },
  {
    "url": "assets/js/16.413d8cd4.js",
    "revision": "934dd6ae2d1b666cb6fdad849fb9a246"
  },
  {
    "url": "assets/js/17.686a22a4.js",
    "revision": "327c351abfaec2ccf75243e38a6debe9"
  },
  {
    "url": "assets/js/18.23871b2e.js",
    "revision": "3d61e892a06b245d008f55dccc949f22"
  },
  {
    "url": "assets/js/19.1ee177fc.js",
    "revision": "49cd05918076a49668bc001a9076d2d1"
  },
  {
    "url": "assets/js/2.ca8ff417.js",
    "revision": "bda1387a0a9dec0c6299ca1aaea97385"
  },
  {
    "url": "assets/js/20.edd59e67.js",
    "revision": "820655141d5524fe7a46abf63983f565"
  },
  {
    "url": "assets/js/21.afec8d36.js",
    "revision": "3575383710b3984d4bc1aa2ea0abf6ba"
  },
  {
    "url": "assets/js/22.04b05eba.js",
    "revision": "150b1b56a3acd50bd2ac7645e3139ad1"
  },
  {
    "url": "assets/js/23.fcf2da0b.js",
    "revision": "0de971c3608d0bcdcaaf9a2b82747086"
  },
  {
    "url": "assets/js/24.1d683b70.js",
    "revision": "f1249d15186e6adb0735716c2c49d27e"
  },
  {
    "url": "assets/js/25.2ba4811d.js",
    "revision": "096faa7ebcb2c7970901ac2824e6f236"
  },
  {
    "url": "assets/js/26.44d5d31b.js",
    "revision": "14751024d19b92e65791655977d902f0"
  },
  {
    "url": "assets/js/3.e0b8c2df.js",
    "revision": "143c3709d8282916d20d932c3d3f51fc"
  },
  {
    "url": "assets/js/4.1a55f0b9.js",
    "revision": "7cb2be0a98253923e3fdc57345ffe9d0"
  },
  {
    "url": "assets/js/5.b37491e9.js",
    "revision": "01fa0231f9ec7471e3462101b71089bb"
  },
  {
    "url": "assets/js/6.aff2de96.js",
    "revision": "8f500a81c158ccf65579771aeec2475c"
  },
  {
    "url": "assets/js/7.e04c90a7.js",
    "revision": "79e182942f94fda26d98866cada887e1"
  },
  {
    "url": "assets/js/8.a18fc0f3.js",
    "revision": "38e317261c2c74470084d842a06ff143"
  },
  {
    "url": "assets/js/app.c2db0d88.js",
    "revision": "2ce6f907befab28034fb9e84d9d7b66b"
  },
  {
    "url": "assets/js/vendors~docsearch.26f41c14.js",
    "revision": "e3adfac55021ea042846e5bc5f98d977"
  },
  {
    "url": "index.html",
    "revision": "e74fc466b9e3b94e6b23c1b94e80e8da"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
