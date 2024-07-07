<template>
  <video
    :class="`${prefixCls} relative w-full h-full m-auto `"
    controls
    :muted="props.muted"
    id="containerRef"
    ref="containerRef"
  >
    Your browser is too old which doesn't support HTML5 video.
  </video>
</template>
<script lang="ts" setup>
  import { useDesign } from '@/hooks/web/useDesign';
  import { ref, reactive, onUnmounted, watch } from 'vue';
  import { isDevMode } from '@/utils/env';
  import { useZlmRtc } from './useZlmRtc';
  const containerRef = ref();
  const { prefixCls } = useDesign('video-rtp-play');
  const props = defineProps({
    //播放url
    videoUrl: {
      type: String,
      default: null,
    },
    //是否开启视频
    audioEnable: {
      type: Boolean,
      default: true,
    },
    //是否开启音频
    videoEnable: {
      type: Boolean,
      default: true,
    },
    //是否开启音频
    muted: {
      type: Boolean,
      default: true,
    },
  });

  const use = reactive({
    zlmsdpUrl: props.videoUrl,
    debug:isDevMode(),
    audioEnable: props.audioEnable,//是否开启视频
    videoEnable: props.videoEnable,//是否开启音频
  });

  const { play, destroy } = useZlmRtc(use, containerRef);
  
  watch(
    () => props.videoUrl,
    () => {
      use.zlmsdpUrl = props.videoUrl;
    },
    { immediate: true, deep: true },
  );

  onUnmounted(() => {
    destroy();
  });

  defineExpose({ play, destroy });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-video-rtp-play';
  .@{prefix-cls} {
  }
</style>
