<template>
  <div ref="father" class="scrapingCard">
    <canvas ref="canvas"></canvas>
    <div class="prize-text">
      <div>一等奖</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
export default {
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },

  setup(props) {
    let isDraw = ref(false);
    let father = ref(null);
    let ctx = null;
    let canvas = ref(null);
    // canvas的value值
    let canvasVal = null;
    // 记录起始点X轴位置
    let targetX = ref(0);
    // 记录起始点Y轴位置
    let targetY = ref(0);
    // 坐标位置更新了几次，
    let changeCount = 0;
    const config = props.config;
    // 是否停止触发，用于控制isDraw变化后只触发一次，touchmove过程中isDraw实际上是处在一直变化的过程的
    let isStop = false;
    watch(
      [targetX, targetY, isDraw],
      ([targetX, targetY, isDraw], [targetXPrev, targetYPrev, isDrawPrev]) => {
        if (isDraw && !isStop) {
          changeCount = 0;
          isStop = true;
        }
        changeCount++;
        // console.log(changeCount, targetX, targetXPrev);
        // 初始化时禁止画线,由于watch先触发一次一次初始值，所以changeCount应该大于2
        if (targetXPrev !== 0 && changeCount > 2) {
          ctx.beginPath();
          ctx.lineWidth = 10;
          ctx.moveTo(targetX, targetY);
          ctx.lineTo(targetXPrev, targetYPrev);
          ctx.stroke();
        }
      }
    );
    onMounted(() => {
      canvasVal = canvas.value;
      createCanvas();
      canvasVal.ontouchstart = touchStart;
      canvasVal.addEventListener("touchmove", touchMove);
      canvasVal.ontouchend = touchEnd;
    });
    function createCanvas() {
      ctx = canvasVal.getContext("2d");
      ctx.fillStyle = config.bgColor;
      // 创建canvas巨型，通过获取父元素的宽高绘制,
      // !可能有兼容性
      const width = father.value.offsetWidth;
      const height = father.value.offsetHeight;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = config.color;
      //   居中设置必须放在fillText前
      ctx.textBaseline = "middle"; //设置文本的垂直对齐方式
      ctx.textAlign = "center"; //设置文本的水平对齐方式
      ctx.fillText(config.text, width / 2, height / 2);
    }
    function touchMove(e) {
      e.stopPropagation();
      if (!isDraw.value) return;
      // 计算鼠标在canvas里的位置
      const x = e.touches[0].pageX - canvasVal.offsetLeft;
      const y = e.touches[0].pageY - canvasVal.offsetTop;
      targetX.value = x;
      targetY.value = y;
      // 设置globalCompositeOperation
      ctx.globalCompositeOperation = "destination-out";
      // 画圆
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      // 填充圆形
      ctx.fill();
    }
    function touchEnd() {
      isDraw.value = false;
    }
    function touchStart() {
      isDraw.value = true;
      isStop = false;
    }
    return {
      canvas,
      father
    };
  }
};
</script>

<style scoped>
.scrapingCard {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.prize-text {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
/* canvas {
  height: 100%;
} */
</style>
