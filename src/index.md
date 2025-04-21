---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "LTP's Notes"
  text: "已有的事，后必再有  已行的事，后必再行"
  tagline: 生前何必久睡，死后自会长眠
  image: /vitepress-logo-large.svg
  actions:
    - theme: alt
      text: 深入理解Java虚拟机
      link: /know_jvm
    - theme: brand
      text: 随手记
      link: /notes
    - theme: alt
      text: Spring
      link: /spring
    - theme: brand
      text: Java多线程与并发
      link: /juc/concurrency-base.md
    - theme: alt
      text: Maven
      link: /maven/maven.md
    - theme: brand
      text: 数据库
      link: /database/database-design.md
    - theme: alt
      text: 设计模式
      link: /design_pattern/discuss-composite-extend.md
features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

<BlogIndex />

<script setup>
import BlogIndex from './component/BlogIndex.vue'
</script>

<style scope>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
  /*hero logo背景渐变色 */
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg,
    #bd34fe 50%,
    #47caff 50%
  );
  --vp-home-hero-image-filter: blur(40px);
}
</style>


