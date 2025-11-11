/// <reference types="vite/client" />

export {}

declare module '*.vue' {
  // import { DefineComponent } from 'vue'
  // const component: DefineComponent<{}, {}, any>
  // export default component
}

declare module 'three';


declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
