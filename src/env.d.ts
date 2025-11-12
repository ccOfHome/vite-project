/// <reference types="vite/client" />

export {}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
  interface ComponentCustomProperties {
    $filters: any
  }
}

declare module 'three';

declare module 'vue-virtual-scroller' {
  // import { DefineComponent } from 'vue'
  // const component: DefineComponent<{}, {}, any>
  // export default component
}

// three 示例库缺少类型声明，添加模块声明以通过类型检查
declare module 'three/examples/jsm/libs/tween.module.min.js' {
  export const TWEEN: any
}


declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
