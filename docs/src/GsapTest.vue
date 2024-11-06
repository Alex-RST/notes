<template>
<button @click="click" >运行</button>

<div id="demo">
  <div class="box green" style="background-color:#989898;width: 50px;height: 50px;position: relative;border-radius: 6px;margin-top: 4px;display: inline-block"></div>
  <div class="box grey" style="background-color:#989898;width: 50px;height: 50px;position: relative;border-radius: 6px;margin-top: 4px;display: inline-block"></div>
  <div class="box orange" style="background-color:#989898;width: 50px;height: 50px;position: relative;border-radius: 6px;margin-top: 4px;display: inline-block"></div>
  <div class="box green" style="background-color:#989898;width: 50px;height: 50px;position: relative;border-radius: 6px;margin-top: 4px;display: inline-block"></div>
  <div class="box grey" style="background-color:#989898;width: 50px;height: 50px;position: relative;border-radius: 6px;margin-top: 4px;display: inline-block"></div>
  <div class="box orange" style="background-color:#989898;width: 50px;height: 50px;position: relative;border-radius: 6px;margin-top: 4px;display: inline-block"></div>
</div>
</template>

<script setup>
import gsap from 'gsap';
function click() {
    console.log("执行动画")
    const tl = gsap.timeline(); 
    tl.to(".box", { duration: 0.5, x: 100 })
    .to(".box", { duration: 0.5, backgroundColor: "#f38630" }, "+=0.5") 
    .to(".box", { duration: 5, x: 0, rotation: -360 }, "+=0.5")
}
</script>

<style>

#demo {
  height: 500px;
  width: 500px;
  margin-top: 4px;  
  background-color: #6fb936;
}
.box {
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 6px;
  margin-top: 4px;
  display: inline-block
}

.green{
  background-color: #6fb936;
}
</style>