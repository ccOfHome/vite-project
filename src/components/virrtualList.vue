<template>
  <div>目前虚拟列表已经有很多知名的库，如 vue-virtual-scroller、vue-virtual-scroll-list、react-virtualized 等</div>
  <div>适用于列表每一项高度确定的情况，高度可设置成相同，也可单独配置每一项高度</div>
  <RecycleScroller
        class="scroller"
        :items="items"
        :item-size="32"
        key-field="id"
        v-slot="{ item }"
    >
        <div class="user" @click="clickItem(item)">
            {{ item.label }}
        </div>
  </RecycleScroller>
  <!-- items: 需要渲染的列表，itemSize: 列表项的高度，keyField: 列表循环的key值 -->
  <br><hr><br>
  <div>适用于列表每一项高度不确定的情况</div>
  <DynamicScroller class="scroller1" :items="items1" :min-item-size="50">
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.label]"
        :data-index="index"
      >
        <div class="desc">{{ item.label }}</div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <!-- minItemSize: 列表项初次渲染使用的最小高度-->
  <!-- active: 保持视图，防止不必要的重新计算 -->
  <!-- sizeDependencies: 影响高度的值，如果发生变化，则重新计算 -->
  <br><hr><br>
  <div>实现一个简易版的虚拟列表</div>
  <!-- 最底层的可视区容器 -->
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent">
    <!-- 中间的可滚动区域，z-index=-1，高度和真实列表相同，目的是出现相同的滚动条 -->
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <!-- 最上层的可视区列表，数据和偏移距离随着滚动距离的变化而变化 -->
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: itemSize + 'px' }"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed, onMounted, getCurrentInstance } from 'vue'
import { RecycleScroller, DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default defineComponent({
    name: 'VirtualList',
    components: {
        RecycleScroller,
        DynamicScroller,
        DynamicScrollerItem
    },
    setup() {
        const { ctx } = getCurrentInstance()
        // console.log(ctx)

        const itemSize = ref(50) // 列表项高度

        const state = reactive({
            items: [],
            items1: [],
            items2: [],
            // 列表总高度
            listHeight: computed(() => {
                return state.items2.length * itemSize.value
            }),
            // 可视区列表的项数
            visibleCount: computed(() => {
                return Math.ceil(screenHeight.value / itemSize.value)
            }),
            // 可视区列表偏移距离对应的样式
            getTransform: computed(() => {
                return `translate3d(0, ${startOffset.value}px, 0)`
            }),
            // 获取可视区列表数据
            visibleData: computed(() => {
                return state.items2.slice(startIndex.value, Math.min(endIndex.value, state.items2.length))
            })
        })

        const startIndex = ref(0) // 起始索引
        const endIndex = ref(0) // 结束索引
        const startOffset = ref(0) // 偏移距离
        const screenHeight = ref(0) // 可视区域高度

        for(let i = 0; i < 10000; i++) {
            state.items.push({
                id: i,
                label: `virtual-list ${i}`
            })
            state.items2.push({
                id: i,
                label: `virtual-list ${i}`
            })
            if(i % 2 == 0) {
                state.items1.push({
                    id: i,
                    label: `virtual-list ${i}`
                })
            } else {
                state.items1.push({
                    id: i,
                    label: `virtual-list ${i}CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCSSSSSSSSSSSSSSSSSS`
                })
            }
        }

        onMounted(() => {
            screenHeight.value = ctx.$refs.list.clientHeight
            startIndex.value = 0
            endIndex.value = startIndex.value + state.visibleCount
        })

        const clickItem = (item) => {
          console.log(item, item.id)
        }

        const scrollEvent = function() {
            // 当前滚动位置
            let scrollTop = ctx.$refs.list.scrollTop
            // 此时的开始索引
            startIndex.value = Math.floor(scrollTop / itemSize.value)
            // 此时的结束索引
            endIndex.value = startIndex.value + state.visibleCount
            // 此时的偏移距离
            startOffset.value = scrollTop - (scrollTop % itemSize.value)


            console.log(startIndex.value, endIndex.value, startOffset.value)
        }

        return {
            ...toRefs(state),
            itemSize,
            scrollEvent,
            clickItem
        }
    },
})
</script>

<style scoped>
.scroller {
  width: 100%;
  height: 200px;
  overflow-y: scroll;
}

.user {
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border: 1px solid #222;
}


.scroller1 {
  width: 100%;
  /* height: 100%; */
  height: 200px;
  overflow-y: scroll;
}
.desc {
  padding: 12px;
  text-align: center;
  border: 1px solid #ccc;
}


.infinite-list-container {
  height: 300px;
  overflow: auto;
  position: relative;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}

.infinite-list-item {
  line-height: 50px;
  text-align: center;
  color: #555;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
</style>
