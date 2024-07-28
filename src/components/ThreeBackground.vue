<template>
  <div ref="container" class="background-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import * as THREE from 'three'

export default defineComponent({
  name: 'ThreeBackground',
  setup() {
    const container = ref<HTMLDivElement | null>(null)

    onMounted(() => {
      if (container.value) {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.value.appendChild(renderer.domElement)

        const geometry = new THREE.SphereGeometry(5, 32, 32)
        const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)

        camera.position.z = 10

        const animate = () => {
          requestAnimationFrame(animate)
          sphere.rotation.x += 0.01
          sphere.rotation.y += 0.01
          renderer.render(scene, camera)
        }

        animate()
      }
    })

    return {
      container
    }
  }
})
</script>

<style scoped>
.background-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  overflow: hidden;
}
</style>
