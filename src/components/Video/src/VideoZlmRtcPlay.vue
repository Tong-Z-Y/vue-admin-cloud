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
    //是否开启音频
    audioEnable: {
      type: Boolean,
      default: true,
    },
    //是否开启视频
    videoEnable: {
      type: Boolean,
      default: true,
    },
    //是否静音
    muted: {
      type: Boolean,
      default: true,
    },
    //是否开启按键
    useDtmf: {
      type: Boolean,
      default: false,
    },
    //是否使用摄像头
    useCamera: {
      type: Boolean,
      default: false,
    },
    //是否仅cv模式
    recvOnly: {
      type: Boolean,
      default: true,
    },
  });

  const use = reactive({
    zlmsdpUrl: props.videoUrl,
    debug:isDevMode(),
    audioEnable: props.audioEnable,
    videoEnable: props.videoEnable,
    useDtmf: props.useDtmf,
    useCamera:props.useCamera,
    recvOnly: props.recvOnly,
  });
  const { success,sendDtmf ,play, destroy } = useZlmRtc(use, containerRef);
  
  watch(
    () => [props.videoUrl || props.audioEnable|| props.videoEnable|| props.useDtmf|| props.useCamera|| props.recvOnly],
    () => {
      use.zlmsdpUrl = props.videoUrl;
      use.audioEnable = props.audioEnable;
      use.videoEnable = props.videoEnable;
      use.useDtmf = props.useDtmf;
      use.useCamera = props.useCamera;
      use.recvOnly = props.recvOnly;
    },
    { immediate: true, deep: true },
  );

  onUnmounted(() => {
    destroy();
  });

  defineExpose({ success,sendDtmf ,play, destroy });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-video-rtp-play';
  .@{prefix-cls} {
  }
</style>
