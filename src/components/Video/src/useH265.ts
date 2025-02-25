import { unref, Ref, reactive, watch, nextTick } from 'vue';
import { isEmpty } from '@/utils/is';
import { deepMerge } from '@/utils';
import { useScript } from '@/hooks/web/useScript';
export interface H265Props {
  videoUrl?: string;
  options?: Recordable;
  hasAudio?: boolean;
  isMute?: boolean;
}
const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

export function useH265(container: Ref, h265Props: H265Props) {
  let h265Player = null as any;
  let playTimer = null as any;
  const { success:suces1 } = useScript({ src: publicPath + 'script/h265web/missile.js' });
  const { success:suces2 } = useScript({ src: publicPath + 'script/h265web/h265webjs-v20221106.js' });

  const stats = reactive({
    loaded: false,
    destroy: true,
    playing: false,
    fullscreen: false,
    isMute: h265Props.isMute || false,
    performance: '',
    kBps: 0,
  });
  const createVideoDom = () => {
    let options = deepMerge(
      {
        width: null,
        height: null,
        // 从github上复制的 https://github.com/numberwolf/h265web.js/blob/master/example_normal/index.js
        token : "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5jb20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9tZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVtYmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1",
        extInfo : {
          coreProbePart : 0.4,
          probeSize : 8192,
          ignoreAudio : 0
        }
      },
      h265Props?.options || {},
    ) as any;
    if (isEmpty(h265Props.videoUrl)) {
      return;
    }
    h265Player = (window as any).new265webjs(h265Props.videoUrl,{player:unref(container).id,...options});
    h265Player.onOpenFullScreen = () => {
      stats.fullscreen = true
    }
    h265Player.onCloseFullScreen = () => {
      stats.fullscreen = false
    }
    h265Player.onReadyShowDone = () => {
      // 准备好显示了，尝试自动播放
      const result = h265Player.play()
      stats.playing = result;
    }
    h265Player.onLoadFinish = () => {
      stats.loaded = true;
      // 可以获取mediaInfo
      // @see https://github.com/numberwolf/h265web.js/blob/8b26a31ffa419bd0a0f99fbd5111590e144e36a8/example_normal/index.js#L252C9-L263C11
      // const data = h265Player.mediaInfo();
      // stats.kBps = data.fps;
    }
    h265Player.onPlayTime = (...args) => {
      // console.log(args)
    }
    h265Player.do()
    stats.destroy = false;
  };
  /**
   * 播放事件
   */
  const play = (url?: string) => {
    if (isEmpty(h265Props.videoUrl)) {
      return;
    }else if(isEmpty(h265Props?.options?.width) || isEmpty(h265Props?.options?.height)){
      return;
    }
    let sucs = unref(suces1); //true表示已加载静态文件
    if (sucs) {
       sucs = unref(suces2); //true表示已加载静态文件
    }
    const plyUrl = isEmpty(url) ? h265Props.videoUrl : url;
    if (sucs) {
      playTimer && clearInterval(playTimer);
    } else {
      if (!playTimer) {
        playTimer = setInterval(() => {
          play(plyUrl)
        }, 1000);
        setTimeout(() => {
          playTimer && clearInterval(playTimer);
          playTimer = null;
        }, 5000);
      }
      return;
    }
    nextTick(() => {
      if (!h265Player) {
        createVideoDom();
      }
      // if (h265Player.hasLoaded()) {
      //   h265Player.play(plyUrl);
      // }
      // const observer = new ResizeObserver((entries) => {
      //   h265Player && h265Player?.resize();
      // });
      // observer.observe(unref(container));
    });
  };

  /**
   * 暂停/继续 事件 false 暂停 true 继续
   */
  const pause = (isPaly: boolean) => {
    stats.playing = isPaly;
    if (!isPaly) {
      h265Player?.pause();
    } else {
      if (stats.destroy) {
        play();
      } else {
        h265Player?.play();
      }
    }
  };
  /**
   * 截图事件
   */
  const screenshot = () => {
    if (!h265Player) {
      return;
    }
    h265Player?.screenshot();
  };
  /**
   * 声音事件
   * isMute true 有声  false 无声
   */
  const onMute = (isMute: boolean) => {
    if (!h265Player) {
      return;
    }
    stats.isMute = isMute;
    if (isMute) {
      h265Player?.setVoice(1.0);
    } else {
      h265Player?.setVoice(0.0);
    }
  };
  /**
   * 全屏事件
   * screen 是否全屏
   */
  const fullscreenSwich = (screen: boolean) => {
    stats.fullscreen = screen;
    if (!h265Player) {
      return;
    }
    if (screen) {
      h265Player.fullScreen()
    } else {
      h265Player.closeFullScreen()
    }
  };

  /**
   * 刷新
   */
  const refresh = () => {
    destroy();
    play();
  };

  /**
   * 销毁事件
   */
  const destroy = () => {
    playTimer && clearInterval(playTimer);
    playTimer = null;
    stats.destroy = true;
    stats.kBps = 0;
    stats.isMute = false;
    stats.performance = '';
    stats.playing = false;
    if (h265Player) {
      h265Player.release();
    }
    h265Player = null;
  };

  watch(
    () => h265Props,
    () => {
      nextTick(() => {
        //先销毁
        destroy();
        //播放
        play();
      });
    },
    { immediate: true, deep: true },
  );

  return {
    stats,
    play,
    pause,
    refresh,
    screenshot,
    onMute,
    fullscreenSwich,
    destroy,
  };
}
