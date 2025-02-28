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
      <InputNumber v-model:value="stats.scanGroupNo" :min="1" :max="255" >
        <template #addonBefore> 扫描编号 </template>
      </InputNumber>
      <InputNumber v-model:value="stats.scanSpeed" :min="1" :max="4095" >
        <template #addonBefore> 扫描速度 </template>
        <template #addonAfter>
          <Button
            @click="doScanSetSpeed({deviceId: props.deviceId,channelId: props.channelId,scanId: stats.scanGroupNo,speed:stats.scanSpeed})"
            >设置</Button
          >
        </template>
      </InputNumber>
    </div>
    <div class="flex flex-row">
      <Button
        class="flex-1"
        size="small"
        @click="doScanSetLeft({deviceId: props.deviceId,channelId: props.channelId,scanId: stats.scanGroupNo})"
        >左边界</Button
      >
      <Button
        class="flex-1"
        size="small"
        @click="doScanSetRight({deviceId: props.deviceId,channelId: props.channelId,scanId: stats.scanGroupNo})"
        >右边界</Button
      >
      <Button
        type="primary"
        size="small"
        class="flex-1"
        @click="doScanStart({deviceId: props.deviceId,channelId: props.channelId,scanId: stats.scanGroupNo})"
        >扫描</Button
      >
      <Button type="primary" size="small" danger class="flex-1" @click="doScanStop({deviceId: props.deviceId,channelId: props.channelId,scanId: stats.scanGroupNo})"
        >停止</Button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { ApiSelect } from '@/components/Form';
  import { doPtzPresetQuery,doScanStart,doScanStop,doScanSetLeft,doScanSetRight,doScanSetSpeed } from '@/api/video/ptz';
  import {
    Button,
    InputNumber
  } from 'ant-design-vue';

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
      default: 0,
    },
  });

  const stats = reactive({
    selectPresetId: "",//预设位号
    cruiseGroupNo: 1, //巡航组编号
    scanGroupNo: 1, //扫描组编号
    scanSpeed: 1, //扫描速度
  })
</script>