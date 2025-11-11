<template>
  <video id="myVideo" width="800" height="450" controls autoplay>
    <!-- <source src="https://v-cdn.zjol.com.cn/276986.mp4" type="video/mp4" /> -->
  </video>
  <el-row>
    {{msg}}
  </el-row>
  <el-row>
    <el-button type="primary" @click="setMessage('1')">暂停/播放</el-button>
    <el-button type="primary" @click="setMessage('2')">视频播放地址</el-button>
    <el-button type="primary" @click="setMessage('3')">视频总时长</el-button>
    <el-button type="primary" @click="setMessage('4')">播放状态是否处于暂停状态</el-button>
  </el-row>
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
} from "vue"

export default defineComponent({
  name: "Video",
  setup() {
    const state = reactive({
      video: null as any,
    })
    const msg = ref('无信息')

    const setMessage = function(type : String) {
      if(type == '2') {
        msg.value = `视频播放地址: + ${state.video.currentSrc}`
      }
      if(type == '3') {
        msg.value = `视频总时长: + ${state.video.duration}s`
      }
      if(type == '4') {
        msg.value = `播放状态是否处于暂停状态: + ${state.video.paused}`
      }
      if(type == '1') {
        if(state.video.paused) {
          state.video.play()
          msg.value = `视频已播放`
        }else {
          state.video.pause()
          msg.value = `视频已暂停`
        }
      }
    }

    onBeforeMount(() => {
      console.log("onBeforeMount")
    })
    onMounted(() => {
      console.log("onMounted")
      state.video = document.getElementById("myVideo")
      state.video.volume = 0.5
      state.video.currentTime = 0
      state.video.src = '../../public/276986.mp4'
      state.video.addEventListener("loadstart", (e: any) => {
          console.log('视频开始加载' + JSON.stringify(e))
      })
      state.video.addEventListener("durationchange", (e: any) => {
          console.log('总时长变化' + JSON.stringify(e))
      })
      state.video.addEventListener("loadedmetadata", (e: any) => {
          console.log('元信息加载完毕' + JSON.stringify(e))
      })
      state.video.addEventListener("loadeddata", (e: any) => {
          console.log('没有足够的视频、音频帧去播放' + JSON.stringify(e))
      })
      state.video.addEventListener("progress", (e: any) => {
          console.log('视频、音频在下载数据' + JSON.stringify(e))
      })
      state.video.addEventListener("canplay", (e: any) => {
          console.log('可以播放了' + JSON.stringify(e))
      })
      state.video.addEventListener("canplaythrough", (e: any) => {
          console.log('有足够的视频帧播放了' + JSON.stringify(e))
      })
      state.video.addEventListener("play", (e: any) => {
          console.log('播放' + JSON.stringify(e))
      })
      state.video.addEventListener("pause", (e: any) => {
          console.log('暂停' + JSON.stringify(e))
      })
      state.video.addEventListener("seeking", (e: any) => {
          console.log('开始寻址' + JSON.stringify(e))
      })
      state.video.addEventListener("seeked", (e: any) => {
          console.log('结束寻址' + JSON.stringify(e))
      })
      state.video.addEventListener("waiting", (e: any) => {
          console.log('等待' + JSON.stringify(e))
      })
      state.video.addEventListener("playing", (e: any) => {
          console.log('播放中' + JSON.stringify(e))
      })
      state.video.addEventListener("timeupdate", (e: any) => {
          console.log('播放时间更新' + JSON.stringify(e))
      })
      state.video.addEventListener("ended", (e: any) => {
          console.log('结束' + JSON.stringify(e))
      })
      state.video.addEventListener("error", (e: any) => {
          console.log('出错' + JSON.stringify(e))
      })
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
      ...toRefs(state),
      msg,
      setMessage
    }
  },
})
</script>

<style scoped>
</style>
