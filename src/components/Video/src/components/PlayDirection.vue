<template>
  <div :class="`${prefixCls} select-none`">
    <Divider>方向控制</Divider>
    <div class="flex">
      <div class="grow relative flex items-center justify-center h-36">
        <div class="absolute place-content-stretch h-36 w-36 rotate-45 z-0">
          <div
            class="absolute top-0 left-0 h-16 w-16 active:bg-sky-300 border-solid border-1 border-sky-500 rounded-tl-full cursor-pointer"
            @mousedown="ptzCamera('up')"
            @mouseup="ptzCamera('stop')"
          >
            <div
              class="absolute bottom-0 right-0 bg-white w-9 h-9 border-t-1 border-l-1 border-solid border-sky-500 border-b-white border-r-white rounded-tl-full"
            ></div>
            <Icon
              class="absolute cursor-pointer bottom-6.5 right-6.5 z-3 -rotate-45"
              icon="teenyicons-triangle-solid"
              color="#0ea5e9"
            />
          </div>
          <div
            class="absolute top-0 right-0 h-16 w-16 active:bg-sky-300 border-solid border-1 border-sky-500 rounded-tr-full cursor-pointer"
            @mousedown="ptzCamera('right')"
            @mouseup="ptzCamera('stop')"
          >
            <div
              class="absolute bottom-0 left-0 bg-white w-9 h-9 border-t-1 border-r-1 border-solid border-sky-500 rounded-tr-full"
            ></div>
            <Icon
              class="absolute cursor-pointer bottom-6.5 left-6.5 z-3 rotate-45"
              icon="teenyicons-triangle-solid"
              color="#0ea5e9"
            />
          </div>
          <div
            class="absolute bottom-0 left-0 h-16 w-16 active:bg-sky-300 border-solid border-1 border-sky-500 rounded-bl-full cursor-pointer"
            @mousedown="ptzCamera('left')"
            @mouseup="ptzCamera('stop')"
          >
            <div
              class="absolute top-0 right-0 bg-white w-9 h-9 border-b-1 border-l-1 border-solid border-sky-500 rounded-bl-full"
            ></div>
            <Icon
              class="absolute cursor-pointer top-6.5 right-6.5 z-3 rotate-225"
              icon="teenyicons-triangle-solid"
              color="#0ea5e9"
            />
          </div>
          <div
            class="absolute bottom-0 right-0 h-16 w-16 active:bg-sky-300 border-solid border-1 border-sky-500 rounded-br-full cursor-pointer"
            @mousedown="ptzCamera('down')"
            @mouseup="ptzCamera('stop')"
          >
            <div
              class="absolute top-0 left-0 bg-white w-9 h-9 border-b-1 border-r-1 border-solid border-sky-500 rounded-br-full"
            ></div>
            <Icon
              class="absolute cursor-pointer top-6.5 left-6.5 z-3 rotate-135"
              icon="teenyicons-triangle-solid"
              color="#0ea5e9"
            />
          </div>
        </div>
        <div class="absolute bg-white h-22 w-22 border-solid rounded-full z-1"></div>
        <div
          :class="`${audioClickStyle} absolute z-2  h-15 w-15 border-solid rounded-full border-1 border-sky-500 flex items-center justify-center cursor-pointer`"
          @click="audioIntercom"
        >
          <Icon
            class="cursor-pointer"
            :icon="`ic-outline-keyboard-voice`"
            size="40"
            color="#0ea5e9"
          />
        </div>
      </div>
      <div class="flex flex-col space-y-4 content-center justify-center">
        <div class="flex space-x-4">
          <div class="flex-1 flex">
            <Icon
              class="cursor-pointer"
              size="26"
              color="#0ea5e9"
              icon="solar-magnifer-zoom-in-outline"
              @mousedown="ptzCamera('zoomin')"
              @mouseup="ptzCamera('stop')"
            />
          </div>
          <div class="flex-1 flex">
            <Icon
              class="cursor-pointer"
              size="26"
              color="#0ea5e9"
              icon="solar-magnifer-zoom-out-linear"
              @mousedown="ptzCamera('zoomout')"
              @mouseup="ptzCamera('stop')"
            />
          </div>
        </div>
        <div class="flex space-x-4">
          <div class="flex-1 flex">
            <Icon
              class="cursor-pointer"
              size="26"
              color="#0ea5e9"
              icon="mdi:image-filter-center-focus-strong-outline"
              @mousedown="focusCamera('near')"
              @mouseup="focusCamera('stop')"
            />
          </div>
          <div class="flex-1 flex">
            <Icon
              class="cursor-pointer"
              size="26"
              color="#0ea5e9"
              icon="mdi:image-filter-center-focus-weak"
              @mousedown="focusCamera('far')"
              @mouseup="focusCamera('stop')"
            />
          </div>
        </div>
        <div class="flex space-x-4">
          <div class="flex-1 flex">
            <Icon
              class="cursor-pointer"
              size="26"
              color="#0ea5e9"
              icon="ph:aperture-light"
              @mousedown="irisCamera('in')"
              @mouseup="irisCamera('stop')"
            />
          </div>
          <div class="flex-1 flex">
            <Icon
              class="cursor-pointer"
              size="26"
              color="#0ea5e9"
              icon="ph:aperture-fill"
              @mousedown="irisCamera('out')"
              @mouseup="irisCamera('stop')"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <Slider v-model:value="stats.controSpeed" :min="0" :max="100" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, unref, computed,watch } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { doPtzPtz, doPtzFocus,doPtzIris } from '@/api/video/ptz';
  import { isEmpty, isFunction } from '@/utils/is';
  import { useZlmRtc } from '@/components/Video';
  import { useMessage } from '@/hooks/web/useMessage';
  import { setObjToUrlParams } from '@/utils';
  import Icon from '@/components/Icon/Icon.vue';
  import {
    Divider,
    Slider,
  } from 'ant-design-vue';
  const { prefixCls } = useDesign('video-play-model-right-direction');
  const { createMessage } = useMessage();
  const props = defineProps({
    //设备编号
    deviceId: {
      type: String,
      default: null,
    },
    //通道编号
    channelId: {
      type: String,
      default: null,
    },
    auth: {
      type: String,
      default: null,
    },
    audioPushApi: {
      type: Function,
      default: ()=>{},
    },
    //广播推流地址
    broadcastApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
    },
    //广播推流注销
    stopPushApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
    },
  });
  const stats = reactive({
    localSteam : 0,
    controSpeed:30,
    //语音对讲相关
    onAudio: 0 as number, //语音对讲状态 0.关闭中 1.加载中 2.加载完成
    audioTimer: null as any, //语音加载检测器
    audioTimeout: null as any, //语音加载检测器
    broadcastTimer: null as any, //语音广播加载检测器
    broadcastTimeout: null as any, //语音广播加载检测器
  })

  const pushStats = reactive({
    zlmsdpUrl: '',
    audioEnable: true,
    videoEnable: false,
    recvOnly: false,
    debug: true,
  });
  //语音对讲
  const { success, localSteam, destroy } = useZlmRtc(pushStats); //加载 webrtc 语音对讲配置
  const audioClickStyle = computed(() => {
    if (stats.onAudio === 1) {
      return 'bg-amber-200';
    } else if (stats.onAudio === 2) {
      return 'bg-sky-300';
    }
    return '';
  });

  //云台控制请求
  const ptzCamera = async (code: string) => {
    await doPtzPtz({
      deviceId: props.deviceId,
      channelId: props.channelId,
      command: code,
      horizonSpeed: parseInt(stats.controSpeed * 255/100),
      verticalSpeed: parseInt(stats.controSpeed * 255/100),
      zoomSpeed: parseInt(stats.controSpeed * 16/100),
    });
  };
  //聚焦控制
  const focusCamera = async (code: string) => {
    await doPtzFocus({
      deviceId: props.deviceId,
      channelId: props.channelId,
      command: code,
      speed: parseInt(stats.controSpeed * 255/100),
    });
  };
  //光圈控制
  const irisCamera = async (code: string) => {
    await doPtzIris({
      deviceId: props.deviceId,
      channelId: props.channelId,
      command: code,
      speed: parseInt(stats.controSpeed * 255/100),
    });
  };
  // 组件加载中，防止重新点击
  const audioIntercom = async () => {
    if (!isFunction(props.audioPushApi)) {
      return;
    }
    if (stats.onAudio == 1) {
      console.log('组件加载中，防止重新点击');
      return;
    } else if (stats.onAudio == 0) {
      //关闭时触发查询 并 初始化语音组件
      const data = await props.audioPushApi({
        deviceId: props.deviceId,
        channelId: props.channelId,
      });
      pushStats.zlmsdpUrl = authUrl(data);
    }
    initAudio();
  };
  //初始化声音
  const initAudio = () => {
    if (stats.onAudio == 0 || stats.onAudio == 1) {
      stats.onAudio = 1;
      if (!unref(success)) {
        if (!stats.audioTimer) {
          stats.audioTimer = setInterval(() => initAudio(), 500);
          stats.audioTimeout = setTimeout(() => {
            stats.onAudio = 0;
            pushStats.zlmsdpUrl = '';
            stats.audioTimer && clearInterval(stats.audioTimer);
            stats.audioTimer = null;
            stats.audioTimeout && clearInterval(stats.audioTimeout);
            stats.audioTimeout = null;
            //注销对讲器
            destroy();
            if (isFunction(props.audioPushApi)) {
              props.stopPushApi({ deviceId: props.deviceId,channelId: props.channelId,})
            }
            createMessage.error('语音组件加载失败，请检查...');
          }, 5000);
        }
        return;
      }
      stats.onAudio = 1;
      createMessage.loading('语音对讲开启中，请稍后...');
      stats.audioTimer && clearInterval(stats.audioTimer);
      stats.audioTimeout && clearInterval(stats.audioTimeout);
      stats.audioTimer = null;
      stats.audioTimeout = null;
      //加载完成后准备开始语音广播
      initBroadcast();
    } else {
      stats.onAudio = 0;
      pushStats.zlmsdpUrl = '';
      //销毁对讲
      destroy();
      if (isFunction(props.audioPushApi)) {
        props.stopPushApi({ deviceId: props.deviceId,channelId: props.channelId,})
      }
      createMessage.success('语音对讲已关闭。');
    }
  };

  const initBroadcast = async () => {
    //查看流是否已加载
    if (!isFunction(props.broadcastApi)) {
      return;
    }
    stats.localSteam = unref(localSteam);
    if (unref(localSteam) != 2) {
      if (!stats.broadcastTimer) {
        stats.broadcastTimer = setInterval(initBroadcast, 500);
        stats.broadcastTimeout = setTimeout(()=>{
          stats.broadcastTimer && clearInterval(stats.broadcastTimer);
          stats.broadcastTimer = null;
          stats.broadcastTimeout && clearInterval(stats.broadcastTimeout);
          stats.broadcastTimeout = null;
          //注销对讲器
          destroy();
          if (isFunction(props.audioPushApi)) {
            props.stopPushApi({ deviceId: props.deviceId,channelId: props.channelId,})
          }
          stats.onAudio = 0;
          pushStats.zlmsdpUrl = '';
          if(stats.localSteam == 0){
            createMessage.error('语音对讲开启失败，请检查是否有麦克风....');
          }else{
            createMessage.error('语音对讲初始化失败，请联系管理员....');
          }
        }, 5000);
      }
    } else {
      stats.broadcastTimer && clearInterval(stats.broadcastTimer);
      stats.broadcastTimer = null;
      stats.broadcastTimeout && clearInterval(stats.broadcastTimeout);
      stats.broadcastTimeout = null;
      props.broadcastApi({ deviceId: props.deviceId, channelId: props.channelId })
      .then(() => {
        stats.onAudio = 2;
        createMessage.success('语音对讲开启成功');
      })
      .catch((error) => {
        //注销对讲器
        destroy();
        if (isFunction(props.audioPushApi)) {
          props.stopPushApi({ deviceId: props.deviceId,channelId: props.channelId,})
        }
        stats.onAudio = 0;
        stats.localSteam = 0;
        pushStats.zlmsdpUrl = '';
        createMessage.error('语音对讲开启失败,语音流推送失败');
      });
    }
  };
  const authUrl = (url) => {
    if (isEmpty(props.auth)) {
      return url;
    }
    return setObjToUrlParams(url, { token: props.auth });
  };
  const emit = defineEmits(['options-controSpeed']);
  watch(
    () => [stats.controSpeed],
    () => {
      emit('options-controSpeed',stats.controSpeed)
    },
    { immediate: true, deep: true },
  );
</script>