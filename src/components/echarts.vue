<template>
    <div id="main" style="width: 800px; height: 600px"></div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  toRefs,
} from "vue";
import * as echarts from "echarts";

export default defineComponent({
  name: "ECharts",
  setup() {
    onBeforeMount(() => {
      console.log("onBeforeMount");
    });
    onMounted(() => {
      console.log("onMounted");
      let main : any = document.getElementById("main")
      let myChart = echarts.init(main);
      let option = {
        xAxis: {
            data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        yAxis: {},
        series: [
            {
                type: 'scatter',
                data: [220, 182, 191, 234, 290, 330, 310]
            }
        ]
      };
      myChart.setOption(option);
    });
    onBeforeUpdate(() => {
      console.log("onBeforeUpdate");
    });
    onUpdated(() => {
      console.log("onUpdated");
    });
    onBeforeUnmount(() => {
      console.log("onbeforeunload");
    });
    onUnmounted(() => {
      console.log("onUnmounted");
    });
  },
});
</script>

<style scoped>
</style>
