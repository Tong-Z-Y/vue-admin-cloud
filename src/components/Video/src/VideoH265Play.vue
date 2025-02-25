<template>
  <div ref="containerRef" :class="`${prefixCls} relative w-full h-full m-auto `" :id="`${prefixCls}`" >
    <div class="absolute bottom-0 w-full h-8 bg-slate-800 backdrop-opacity-50 flex z-10">
      <div class="h-full w-full flex items-center space-x-3 pl-4">
        <Icon
          class="cursor-pointer"
          :icon="`${!stats.playing ? 'ri:play-fill' : 'ic-sharp-pause'}`"
          size="25"
          color="#f8fafc"
          @click="pause(!stats.playing)"
        />
        <Icon
          class="cursor-pointer"
          icon="ic-baseline-stop"
          size="25"
          color="#f8fafc"
          @click="destroy()"
        />
        <Icon
          class="cursor-pointer"
          :icon="`${stats.isMute ? 'mdi-volume-high' : 'mdi-volume-off'}`"
          size="25"
          color="#f8fafc"
          @click="onMute(!stats.isMute)"
        />
      </div>
      <div class="h-full w-full flex items-center justify-end space-x-3 pr-4">
        <span class="text-white select-none">{{ stats.kBps }} kb/s</span>
        <Icon
          class="cursor-pointer"
          icon="ri-screenshot-fill"
          size="25"
          color="#f8fafc"
          @click="screenshot()"
        />
        <Icon
          class="cursor-pointer"
          icon="ic-twotone-refresh"
          size="25"
          color="#f8fafc"
          @click="refresh()"
        />
        <Icon
          class="cursor-pointer"
          :icon="`${!stats.fullscreen ? 'mdi-fullscreen' : 'mdi-fullscreen-exit'}`"
          size="25"
          color="#f8fafc"
          @click="fullscreenSwich(!stats.fullscreen)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useH265 } from './useH265';
  import { ref, unref, reactive, onMounted,nextTick,onUnmounted, watch } from 'vue';

  const containerRef = ref();
  const { prefixCls } = useDesign('video-play-h265');

  const props = defineProps({
    //播放url
    videoUrl: {
      type: String,
      default: null,
    },
    //是否开启音频解码 默认不开启，
    hasAudio: {
      type: Boolean,
      default: false,
    },
    //播放器参数
    options: {
      type: Object as PropType<Recordable>,
      default: {},
    },
  });
  const use = reactive({
    videoUrl: props.videoUrl,
    options: {
      width: null,
      height: null,
    },
    hasAudio: props.hasAudio,
    isMute: false,
  });
  const { stats, play, pause, refresh, screenshot, onMute, fullscreenSwich, destroy } = useH265(containerRef, use);
  watch(
    () => props.videoUrl,
    () => {
      use.videoUrl = props.videoUrl;
    },
  );
  onMounted(() => {
    nextTick(() => {
      let container = unref(containerRef);
      use.options = {
        width: container?.parentNode?.clientWidth,
        height: container?.parentNode?.clientHeight,
      };
    })
  });
  onUnmounted(() => {
    destroy();
  });
  defineExpose({ play, destroy });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-video-play-h265';
</style>
