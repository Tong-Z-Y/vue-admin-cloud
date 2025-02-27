<template>
  <div :class="`${prefixCls} flex flex-col flex-auto`">
    <Divider class="select-none" >云台控制</Divider>
    <div class="flex flex-col flex-auto">
      <div class="flex flex-col select-none">
        <Select 
        v-model:value="stats.selectComponent" 
        :options="stats.selectOptions"
        />
      </div>
      <component ref="payVideo" :is="payComponent" :deviceId="props.deviceId" :channelId="props.channelId" :controSpeed="props.controSpeed" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive,computed ,defineAsyncComponent} from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import {
    Divider,
    Select
  } from 'ant-design-vue';
  const { prefixCls } = useDesign('video-play-model-right-ptz');
  const PtzPreset = defineAsyncComponent(() => import('./PtzPreset.vue'));
  const PtzCruising = defineAsyncComponent(() => import('./PtzCruising.vue'));
  const PtzScan = defineAsyncComponent(() => import('./PtzScan.vue'));
  const PtzWiper = defineAsyncComponent(() => import('./PtzWiper.vue'));
  const PtzSwitch = defineAsyncComponent(() => import('./PtzSwitch.vue'));
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
    //方向速度
    controSpeed: {
      type: Number,
      default: 30,
    },
  });
  const stats = reactive({
    //选择值
    selectComponent:'PtzPreset',
    selectOptions:[
      {
        value: 'PtzPreset',
        label: '预置点',
      },
      {
        value: 'PtzCruising',
        label: '巡航组',
      },
      {
        value: 'PtzScan',
        label: '自动扫描',
      },
      {
        value: 'PtzWiper',
        label: '雨刷',
      },
      {
        value: 'PtzSwitch',
        label: '辅助开关',
      }
    ],
    cruiseGroupNo: 1, //巡航组编号
    ruiseSpeed: 1, //巡航速度
    ruiseResidenceTime: 1, //巡航停留时间
    scanGroupNo: 1, //扫描组编号
    scanSpeed: 1, //扫描速度
  })

  const payComponent: any = computed(() => {
    if (stats.selectComponent == 'PtzPreset') {
      return PtzPreset;
    }  else if (stats.selectComponent == 'PtzCruising') {
      return PtzCruising;
    }else if (stats.selectComponent == 'PtzScan') {
      return PtzScan;
    }else if (stats.selectComponent == 'PtzWiper') {
      return PtzWiper;
    }else if (stats.selectComponent == 'PtzSwitch') {
      return PtzSwitch;
    }
  });



</script>
<style lang="less">
   @prefix-cls: ~'@{namespace}-video-play-model-right-ptz';
   .@{prefix-cls} {
      .ant-input-number-group-addon:first-child {
        width: 83px;
        border-right: 0;
      }
      .ant-input-number-group-addon:last-child {
        border-left: 0;
        border: none;
        padding: 0;
      }
   }

</style>