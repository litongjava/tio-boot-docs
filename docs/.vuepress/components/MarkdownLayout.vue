<script setup>
import Layout from '@vuepress/theme-default/layouts/Layout.vue';
import CopyMarkdown from './CopyMarkdown.vue';
</script>

<template>
  <Layout>
    <template #page-content-top><CopyMarkdown /></template>
  </Layout>
</template>
