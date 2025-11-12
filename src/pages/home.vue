<template>
  <el-header>
    <el-row>
      <el-col :span="3">
        <router-link to="/about/mapConfig">地图Map</router-link>
        <!-- <router-link :to="{ name: 'about', params: { type: 'mapConfig' }}">地图Map</router-link> -->
      </el-col>
      <el-col :span="3">
        <router-link to="/about/canvas">Canvas: pixi.js</router-link>
        <!-- <router-link :to="{ name: 'about', params: { type: 'canvas' }}">Canvas: pixi.js</router-link> -->
      </el-col>
      <el-col :span="3">
        <router-link to="/about/three">Three.js:3D</router-link>
        <!-- <router-link :to="{ name: 'about', params: { type: 'three' }}">Three.js:3D</router-link> -->
      </el-col>
      <el-col :span="3">
        <router-link to="/about/echarts">echarts</router-link>
        <!-- <router-link :to="{ name: 'about', params: { type: 'echarts' }}">echarts</router-link> -->
      </el-col>
      <el-col :span="3">Todo-List</el-col>
      <el-col :span="3">
        <router-link to="/about/video">Video</router-link>
        <!-- <router-link :to="{ name: 'about', params: { type: 'video' }}">Video</router-link> -->
      </el-col>
      <el-col :span="3">
        <router-link to="/about/virtualList">虚拟列表</router-link>
      </el-col>
      <el-col :span="3">
        <router-link to="/about/djClub">蹦迪夜场</router-link>
      </el-col>
    </el-row>
  </el-header>
  <el-main>
    <el-checkbox-group v-model="state.checked" @change="changeCheck">
      <el-checkbox v-for="(item, index) in state.todoList"
      :key="index"
      :label="item" />
    </el-checkbox-group>
    <div>{{ state.sum }}</div>
  </el-main>
  <el-footer>
    <el-input v-model="inputVal" placeholder="请输入添加的事件" />
    <el-button type="primary" @click="addItem">添加</el-button>
    <el-button type="danger" @click="deleteItem">删除</el-button>
  </el-footer>
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

export default defineComponent({
  name: "Home",
  setup() {
    const state: any = reactive({
      todoList: ["测试1", "测试2", "测试3"],
      checked: [],
      sum: computed(() => {
        return state.todoList.length;
      }),
    })

    const inputVal = ref("")

    const addItem = function () {
      if (inputVal.value == "") return
      state.todoList.push(inputVal.value)
      inputVal.value = ""
    };

    const deleteItem = function () {
      if(state.checked.length == 0) return
      let temp: any = []
      state.todoList.forEach((element: any) => {
        let index = state.checked.indexOf(element)
        if(index == -1) {
          temp.push(element)
        }
      })
      state.todoList = temp
    }

    const changeCheck = function(val: any) {
      // console.log(val, state.checked)
    }

    onBeforeMount(() => {
      console.log("onBeforeMount")
    })
    onMounted(() => {
      console.log("onMounted")
    })
    onBeforeUpdate(() => {
      console.log("onBeforeUpdate")
    })
    onUpdated(() => {
      console.log("onUpdated")
    })
    onBeforeUnmount(() => {
      console.log("onbeforeunload")
    })
    onUnmounted(() => {
      console.log("onUnmounted")
    })

    return {
      // ...toRefs(state),
      state,
      inputVal,
      addItem,
      deleteItem,
      changeCheck
    }
  },
});
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
