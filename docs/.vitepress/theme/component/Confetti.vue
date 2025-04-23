<!--其他彩带样式见： https://www.kirilv.com/canvas-confetti/  -->
<script setup lang="ts">
import confetti from "canvas-confetti";
import { onMounted } from "vue";

onMounted(() => (
  basicCannon()
));

/**
 * 基础彩带
 */
function basicCannon() {
  confetti({
    particleCount: 100,
    spread: 170,
    origin: { y: 0.6 },
  })
}

/**
 * 雪花
 */
function snow() {
  let duration = 15 * 1000;
  let animationEnd = Date.now() + duration;
  let skew = 1;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    let timeLeft = animationEnd - Date.now();
    let ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: (Math.random() * skew) - 0.2
      },
      colors: ['#ffffff'],
      shapes: ['circle'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  }());
}
</script>