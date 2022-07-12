<template>
  <canvas id="threeCanvas"></canvas>
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
import { 
  Scene, 
  Camera, 
  AmbientLight, 
  PointLight, 
  PerspectiveCamera, 
  WebGLRenderer, 
  BoxGeometry, 
  CubeGeometry, 
  MeshBasicMaterial, 
  Mesh, 
  TextureLoader, 
  DoubleSide 
} from 'three'
import Stats from 'stats.js'
// import { OrbitControls } from 'three-orbitcontrols-ts'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let renderer : WebGLRenderer, scene : Scene, mesh : Mesh, camera : PerspectiveCamera, stats : Stats

export default defineComponent({
  name: "Three",
  setup() {
    const state = reactive({
      renderer: null,
      scene: null,
    })

    const threeConfig = function() {
      let canvas = document.getElementById("threeCanvas")
      renderer = new WebGLRenderer({
        canvas,
      })
      renderer.setClearColor(0xFFFF44)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)

      window.addEventListener('resize', () => onWindowResize())

      scene = new Scene();
      // 环境光
      let light = new AmbientLight(0xffffff, 0.4)
      scene.add(light)
      // 相机
      camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000)
      camera.position.set(0, 0, 5)
      // 形状
      let geometry = new BoxGeometry(200, 200, 200)
      // 材质
      let material = new MeshBasicMaterial({color: 0xff0000})
      mesh = new Mesh(geometry, material)
      mesh.position.set(0, 0, -800)
      scene.add(mesh)

      stats = new Stats()
      stats.showPanel(0)
      document.body.appendChild(stats.dom)

      new OrbitControls(camera, renderer.domElement)

      render()
    }

    const onWindowResize = function() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }

    const render = function() {
        window.requestAnimationFrame(() => render())
        stats.begin()
        mesh.rotation.x += 0.01
        mesh.rotation.y += 0.01
        stats.end()
        renderer.render(scene, camera)
    }

    onBeforeMount(() => {
      console.log("onBeforeMount")
    })
    onMounted(() => {
      console.log("onMounted")
      threeConfig()
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
  },
});
</script>

<style scoped>
</style>
