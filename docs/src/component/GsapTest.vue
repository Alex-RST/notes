<template>
  <div>
    <button @click="click">运行</button>
    <div id="demo">
      <div class="box green"></div>
      <div class="box grey"></div>
      <div class="box orange"></div>
      <div class="box green"></div>
      <div class="box grey"></div>
      <div class="box orange"></div>
    </div>
  </div>
</template>

<script setup>
import gsap from 'gsap';
function click() {
  const tl = gsap.timeline();
  tl.to(".box", { duration: 3, x: 100, rotation: 360 })
    .to(".box", { duration: 3, x: 0, rotation: 0 })
}
</script>

<style>
#demo {
  margin-top: 4px;
  margin-top: 4px;
  background-color: #ffffff;
  margin-top: 4px;
  background-color: #ffffff;
}

.box {
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 6px;
  margin: 5px;
  border-top: #000000 2px;
  display: inline-block
}

.green {
  background-color: #6fb936;
}

.grey {
  background-color: #989898;
}

.orange {
  background-color: #ff7722;
}
</style>