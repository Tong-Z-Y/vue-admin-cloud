<template>
  <div :class="`${prefixCls} overflow-y-auto select-none`" >
    <template v-if="isNotEmpty(stats.data)">
      <Divider>概况</Divider>
      <Descriptions  size="small" :column="2">
        <DescriptionsItem label="观看人数">{{ info.readerCount }}</DescriptionsItem>
        <DescriptionsItem label="协议">{{ info.schema }}</DescriptionsItem>
        <DescriptionsItem label="持续时间">{{ info.aliveSecond }}</DescriptionsItem>
        <DescriptionsItem label="网络">{{ info.bytesSpeed }}</DescriptionsItem>
      </Descriptions>
      <Divider v-if="info.videoCodec">视频</Divider>
      <Descriptions  size="small" :column="2" v-if="info.videoCodec">
        <DescriptionsItem label="视频编码">{{ info.videoCodec }}</DescriptionsItem>
        <DescriptionsItem label="视频分辨率">{{ info.videoWidthHeight }}</DescriptionsItem>
        <DescriptionsItem label="视频FPS">{{ info.videoFps }}</DescriptionsItem>
        <DescriptionsItem label="视频丢包率">{{ info.videoLoss }}</DescriptionsItem>
      </Descriptions>
      <Divider v-if="info.audioCodec">音频</Divider>
      <Descriptions  size="small" :column="2" v-if="info.audioCodec">
        <DescriptionsItem label="音频编码">{{ info.audioCodec }}</DescriptionsItem>
        <DescriptionsItem label="音频采样位数">{{ info.audioSampleBit }}</DescriptionsItem>
        <DescriptionsItem label="音频采样率">{{ info.audioSampleRate }}</DescriptionsItem>
      </Descriptions>
    </template>
    <p v-else>暂无数据</p>
  </div>
</template>
<script lang="ts" setup> 
  import { onMounted ,onUnmounted,reactive, computed, watch} from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { isNotEmpty } from '@/utils/is';
  import {
    Descriptions,
    DescriptionsItem,
    Divider,
  } from 'ant-design-vue';
  import {doMediaInfo } from '@/api/video/mediaServer';

  const { prefixCls } = useDesign('video-play-model-right-stream');
  const props = defineProps({
    //设备编号
    app: {
      type: String,
      default: null,
    },
    //通道编号
    stream: {
      type: String,
      default: null,
    },
    //流媒体编号
    mediaServerId: {
      type: String,
      default: null,
    },
  });
  const stats = reactive({
    task: null as any,
    data: {
      tracks: [] as any,
    } as any,
  }); 
  const info = computed(() => {
    const info = {};
    info['readerCount'] = stats.data?.totalReaderCount || 0; //观看人数
    info['schema'] = stats.data?.schema || 0; //协议
    info['aliveSecond'] = formatAliveSecond(stats.data?.aliveSecond  || 0);//持续时间
    info['bytesSpeed'] = formatByteSpeed(stats.data?.bytesSpeed  || 0);//网络
    stats.data?.tracks.forEach((item) => {
      if (item.codec_type == '0'){
        info['videoCodec'] = item?.codec_id_name || '';//视频编码
        info['videoWidthHeight'] = (item?.width || 0) +"x"+(item?.height || 0);//视频分辨率
        info['videoFps'] = item?.fps || 0//视频FPS
        info['videoLoss'] = item?.loss || 0//视频丢包率
      }else if (item.codec_type == '1'){
        info['audioCodec'] = item?.codec_id_name || '';//音频编码
        info['audioSampleBit'] = item?.sample_bit || 0 //音频采样位数
        info['audioSampleRate'] = item?.sample_rate || 0 //音频采样率
      }
    });
    return info as any;
  });

  const findMediaInfo = () => {
    doMediaInfo({
      app: props.app,
      stream: props.stream,
      mediaServerId: props.mediaServerId,
    }).then((res) => {
      stats.data = res.data;
    }).catch(() => {
      stats.data = {};
      stopTask();
    });
  };

  const startTask = () => {
    stats.task = setInterval(() => {findMediaInfo();}, 1000);
  };  

  const stopTask = () => {
    if (stats.task){
      clearInterval(stats.task);
    }
  }; 

  const formatByteSpeed = (bytesSpeed) =>{
    let num = 1024.0 //byte
      if (bytesSpeed < num) return bytesSpeed + ' B/S'
      if (bytesSpeed < Math.pow(num, 2)) return (bytesSpeed / num).toFixed(2) + ' KB/S' //kb
      if (bytesSpeed < Math.pow(num, 3))
        return (bytesSpeed / Math.pow(num, 2)).toFixed(2) + ' MB/S' //M
      if (bytesSpeed < Math.pow(num, 4))
        return (bytesSpeed / Math.pow(num, 3)).toFixed(2) + ' G/S' //G
      return (bytesSpeed / Math.pow(num, 4)).toFixed(2) + ' T/S' //T
  }
  const formatAliveSecond = (aliveSecond) =>{
    const h = parseInt(aliveSecond / 3600)
    const minute = parseInt((aliveSecond / 60) % 60)
    const second = Math.ceil(aliveSecond % 60)

    const hours = h < 10 ? 0 + h : h
    const formatSecond = second > 59 ? 59 : second
    return `${hours > 0 ? `${hours}小时` : ''}${minute < 10 ? '0' + minute : minute}分${
      formatSecond < 10 ? '0' + formatSecond : formatSecond
    }秒`
  }

  watch(
    () => [props.app || props.stream|| props.mediaServerId],
    () => {
      if(props.app && props.stream && props.mediaServerId){
        startTask();
      }
    },
    { immediate: true, deep: true },
  );
  onUnmounted(() => {
    stopTask();
  });

</script>
<style lang="less">
   @prefix-cls: ~'@{namespace}-video-play-model-right-stream';
   .@{prefix-cls} {
      min-height: 186px;
      height: 186px;
      .ant-descriptions-item .ant-divider-horizontal {
        margin: 5px 0;
      }
   }

</style>