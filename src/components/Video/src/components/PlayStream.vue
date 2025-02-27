<template>
  <div :class="`${prefixCls} select-none`" data-simplebar>
    <Divider>流信息</Divider>
    <p v-if="isEmpty(props.tracks)">暂无数据</p>
    <Descriptions size="small" :column="1" v-if="isNotEmpty(props.tracks)">
      <template :key="index" v-for="(val, index) in props.tracks">
        <template v-if="val.codecType == 0">
          <DescriptionsItem label="格式">{{ val?.codecIdName }}</DescriptionsItem>
          <DescriptionsItem label="类型">视频</DescriptionsItem>
          <DescriptionsItem label="分辨率"
            >{{ val.width }} x {{ val.height }}</DescriptionsItem
          >
          <DescriptionsItem label="帧率">{{ val.fps }}</DescriptionsItem>
        </template>
        <template v-if="val.codecType == 1"
          >>
          <DescriptionsItem label="格式">{{ val.codecIdName }}</DescriptionsItem>
          <DescriptionsItem label="类型">音频</DescriptionsItem>
          <DescriptionsItem label="采样位数">{{ val.sampleBit }}</DescriptionsItem>
          <DescriptionsItem label="采样率">{{ val.sampleRate }}</DescriptionsItem>
        </template>
        <template v-if="index < props.tracks.length - 1">
          <DescriptionsItem><Divider /></DescriptionsItem>
        </template>
      </template>
    </Descriptions>
  </div>
</template>
<script lang="ts" setup> 
  import { useDesign } from '@/hooks/web/useDesign';
  import { isEmpty, isNotEmpty } from '@/utils/is';
  import {
    Descriptions,
    DescriptionsItem,
    Divider,
  } from 'ant-design-vue';

  const { prefixCls } = useDesign('video-play-model-right-stream');

  const props = defineProps({
    //流编码信息
    tracks: {
      type: Array as PropType<any[]>,
      default: [],
    },
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