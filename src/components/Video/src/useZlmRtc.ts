import { unref, ref, Ref, watch, nextTick } from 'vue';
import { useScript } from '@/hooks/web/useScript';
import { isEmpty } from '@/utils/is';
import { deepMerge } from '@/utils';


const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

export interface RtcProps {
  zlmsdpUrl?: string;
  debug?: boolean;
  simulecast?: boolean;
  useCamera?: boolean;
  audioEnable?: boolean;
  videoEnable?: boolean;
  recvOnly?: boolean;
}

export function useZlmRtc(rtcProps: RtcProps, container?: Ref) {
  const { success } = useScript({ src: publicPath + 'script/zlmRTC/ZLMRTCClient.js' });
  let zlmRtcClient = null as any;
  let timer = null as any;
  let playTimer = null as any;
  let playTimeout = null as any;
  let localSteam = ref(0);//0 表示流未传输 1.表示本地流以加载，但初始化失败 2.表示加载成功可进行下一步

  //初始化video
  const createVideoDom = () => {
    let initBoolean = false;
    if (isEmpty(rtcProps.zlmsdpUrl)) {
      return initBoolean;
    }
    try{
      zlmRtcClient = new (window as any).ZLMRTCClient.Endpoint({
        ...deepMerge(
          {
            zlmsdpUrl: '', //播放流地址
            debug: false, // 是否打印日志
            simulcast: false,// 是否联播
            useCamera: false,//是否使用相机
            audioEnable: true,//是否开启视频
            videoEnable: true,//是否开启音频
            recvOnly: true,//是否仅cv模式
            usedatachannel: false//是否使用数据通道
          },
          rtcProps || {},
        ),
        element: unref(container) || '', // video 标签
      });
      initBoolean = true;
    }catch (error) {
      console.log('初始化webRTP失败：' + error);
      return initBoolean;
    }
    zlmRtcClient.on('WEBRTC_INIT_ZLMSDP_URL_ERR', (e) => {
      // 初始化报错TGGT
      eventcallbacK('加载播放时报错：', e);
    });
    zlmRtcClient.on('WEBRTC_ICE_CANDIDATE_ERROR', (e) => {
      // ICE 协商出错
      eventcallbacK('ICE ERROR', 'ICE 协商出错');
    });

    zlmRtcClient.on('WEBRTC_ON_REMOTE_STREAMS', (e) => {
      //获取到了远端流，可以播放
      eventcallbacK('playing', '播放成功');
    });

    zlmRtcClient.on('WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED', (e) => {
      // offer anwser 交换失败
      eventcallbacK('OFFER ANSWER ERROR ', 'offer anwser 交换失败');
      if (e.code == -400 && e.msg == '流不存在') {
        console.log('流不存在');
        timer = setTimeout(() => {
          zlmRtcClient.close();
          createVideoDom();
        }, 100);
      }
    });
    zlmRtcClient.on('WEBRTC_ON_LOCAL_STREAM', (s) => {
      // 获取到了本地流
      localSteam.value = 1;
      eventcallbacK('LOCAL STREAM', '获取到了本地流');
    });
    zlmRtcClient.on('WEBRTC_ON_INIT_STAUTS', () => {
      // 自定义改动zlmrct.js事件 添加此事件表示加载成功
      localSteam.value = 2;
      eventcallbacK('LOCAL STREAM', '加载流媒体成功');
    });
    return initBoolean;
  };
  //播放
  const play = () => {
    if (isEmpty(rtcProps.zlmsdpUrl)) {
      return false;
    }
    if (unref(success)) {
      // 没有初始化成功直接返回
      if (!zlmRtcClient && !createVideoDom()) {
        return false;
      }
      console.log("stats : "+zlmRtcClient?.pc?.connectionState);
      if(!playTimer){
        playTimer = setInterval(() => play(), 200);
        playTimeout = setTimeout(() => {
          playTimer && clearInterval(playTimer);
          playTimer = null;
          playTimeout = null;
        }, 5000);
      }
      // new  connected:准备完成
      if(zlmRtcClient?.pc?.connectionState === "connected"){
        unref(container)?.play();
        playTimer && clearInterval(playTimer);
        playTimeout && clearTimeout(playTimeout);
        playTimer = null;
        playTimeout = null;
      }
    } else {
      if (!playTimer) {
        playTimer = setInterval(() => play(), 200);
        playTimeout = setTimeout(() => {
          playTimer && clearInterval(playTimer);
          playTimer = null;
          playTimeout = null;
        }, 5000);
      }
      return;
    }
  };
  //暂停
  const pause = () => {
    if (!zlmRtcClient) {
      return;
    }
    zlmRtcClient.close();
    localSteam.value = 0;
  };
  /**
   * 销毁事件
   * @returns
   */
  const destroy = () => {
    timer && clearTimeout(timer);
    playTimer && clearInterval(playTimer);
    playTimeout && clearTimeout(playTimeout);
    localSteam.value = 0;
    timer = null;
    playTimer = null;
    playTimeout = null;
    if (!zlmRtcClient) {
      return;
    }
    zlmRtcClient.close();
    zlmRtcClient = null;
  };

  watch(
    () => rtcProps,
    () => {
      nextTick(() => {
        //先注销
        destroy();
        //然后播放
        play();
      });
    },
    { immediate: true, deep: true },
  );

  /**
   * Rtc播放事件
   * @param type 事件类型
   * @param message 事件消息
   */
  const eventcallbacK = (type: string, message: string) => {
    console.log('RTC 事件回调 type:' + type + ' message:' + message);
  };
  return { zlmRtcClient, success, localSteam, play, pause, destroy };
}
