<template>
  <div class="flex flex-col space-y-1">
    <div>
      <ApiSelect 
        class="w-full"
        v-model:value="stats.selectPresetId" 
        :api="doPtzPresetQuery"
        :defValOne="true"
        :params="{deviceId: props.deviceId,channelId: props.channelId}"
        labelField= "presetName"
        valueField= "presetId"  
      >
        <template #addonBefore> 预置点 </template>
      </ApiSelect>
      <InputNumber v-model:value="stats.cruiseGroupNo" :min="1" :max="255" >
        <template #addonBefore> 巡航编号 </template>
        <template #addonAfter>
          <Button
            type="primary"
            @click="doCruisePointAdd({deviceId: props.deviceId,channelId: props.channelId,presetId:stats.selectPresetId,cruiseId: stats.cruiseGroupNo})"
            >添加
          </Button>
          <Button
            @click="doCruisePointDel({deviceId: props.deviceId,channelId: props.channelId,presetId:stats.selectPresetId,cruiseId: stats.cruiseGroupNo})"
            >删除
          </Button>
        </template>
      </InputNumber>
      <InputNumber v-model:value="stats.ruiseSpeed" :min="1" :max="4095" >
        <template #addonBefore> 巡航速度 </template>
        <template #addonAfter>
          <Button
            @click="doCruisePointSpeed({deviceId: props.deviceId,channelId: props.channelId,cruiseId: stats.cruiseGroupNo,speed:stats.ruiseSpeed})"
            >设置</Button
          >
        </template>
      </InputNumber>
      <InputNumber
        v-model:value="stats.ruiseResidenceTime"
        :min="1"
        :max="4095"
      >
        <template #addonBefore> 停留时间 </template>
        <template #addonAfter>
          <Button
            @click="doCruisePointTime({deviceId: props.deviceId,channelId: props.channelId,cruiseId: stats.cruiseGroupNo,time:stats.ruiseResidenceTime})"
            >设置</Button
          >
        </template>
      </InputNumber>
    </div>
    <div class="flex flex-row">
      <Button
        type="primary"
        class="flex-1"
        @click="doCruisePointStart({deviceId: props.deviceId,channelId: props.channelId,cruiseId: stats.cruiseGroupNo})"
        >开始巡航</Button
      >
      <Button
        class="flex-1"
        @click="doCruisePointStop({deviceId: props.deviceId,channelId: props.channelId,cruiseId: stats.cruiseGroupNo})"
        >停止巡航</Button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { ApiSelect } from '@/components/Form';
  import {
    Button,
    InputNumber
  } from 'ant-design-vue';
  import { 
    doPtzPresetQuery,
    doCruisePointAdd, 
    doCruisePointDel, 
    doCruisePointSpeed, 
    doCruisePointTime, 
    doCruisePointStart, 
    doCruisePointStop, 
  } from '@/api/video/ptz';

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
  });

  const stats = reactive({
    selectPresetId: "",//预设位号
    cruiseGroupNo: 1, //巡航组编号
    ruiseSpeed: 1, //巡航速度
    ruiseResidenceTime: 1, //巡航停留时间
  })
</script>