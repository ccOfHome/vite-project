<template>
  <div id="container" style="width: 800px; height: 600px"></div>
</template>

<script lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
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

export default defineComponent({
  name: "Map",
  setup() {
    const state = reactive({
        map: null
    })

    onBeforeMount(() => {});
    onMounted(() => {
      console.log("onMounted");
      AMapLoader.load({
        key: "", // 申请好的Web端开发者Key，首次调用 load 时必填 // 446a0822ed6958b3db523db8a6f48b3f
        version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: "1.1", // AMapUI 缺省 1.1
          plugins: [], // 需要加载的 AMapUI ui插件
        },
        Loca: {
          // 是否加载 Loca， 缺省不加载
          version: "1.3.2", // Loca 版本，缺省 1.3.2
        },
      })
        .then((AMap) => {
          state.map = new AMap.Map("container", {
            zooms: [4, 16],
            zoom: 11,                                        //级别
            center: [120.153576, 30.287459],                 //中心点坐标
            viewMode: '3D',                                   //使用3D视图
            layers: [  //使用多个图层
              new AMap.TileLayer.Satellite(),
              new AMap.TileLayer.RoadNet()
            ]
          });
          //实时路况图层
          var trafficLayer = new AMap.TileLayer.Traffic({
              zIndex: 10
          });
          state.map.add(trafficLayer);//添加图层到地图
        })
        .catch((e) => {
          console.log(e);
        });
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

    return {};
  },
});
</script>

<style scoped>
</style>
