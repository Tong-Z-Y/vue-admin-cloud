<template>
  <div class="flex flex-col space-y-1">
    <div>
      <InputNumber v-model:value="stats.scanSpeed" :min="1" :max="4095" size="small">
        <template #addonBefore> 扫描速度 </template>
        <template #addonAfter>
          <Button
            size="small"
            @click="
              ptzCommand(
                138,
                stats.scanGroupNo,
                stats.scanSpeed % 256,
                Math.floor(stats.scanSpeed / 256) * 16
              )
            "
            >设置</Button
          >
        </template>
      </InputNumber>
      <InputNumber v-model:value="stats.scanGroupNo" :min="1" :max="255" size="small">
        <template #addonBefore> 扫描组编号 </template>
      </InputNumber>
    </div>
    <div class="flex flex-row">
      <Button
        class="flex-1"
        size="small"
        @click="ptzCommand(137, stats.cruiseGroupNo, 1, 0)"
        >左边界</Button
      >
      <Button
        class="flex-1"
        size="small"
        @click="ptzCommand(137, stats.cruiseGroupNo, 2, 0)"
        >右边界</Button
      >
      <Button
        type="primary"
        size="small"
        class="flex-1"
        @click="ptzCommand(137, stats.cruiseGroupNo, 0, 0)"
        >扫描</Button
      >
      <Button type="primary" size="small" danger class="flex-1" @click="ptzCamera('stop')"
        >停止</Button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { doPtzPtz,doPtzFrontEndCommand } from '@/api/video/ptz';
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
    cruiseGroupNo: 1, //巡航组编号
    scanGroupNo: 1, //扫描组编号
    scanSpeed: 1, //扫描速度
  })


   //云台指令请求
 const ptzCommand = async (
    code: number,
    parameter1: number,
    parameter2: number,
    combindCode2: number,
  ) => {
    await doPtzFrontEndCommand({
      deviceId: props.deviceId,
      channelId: props.channelId,
      cmdCode: code,
      parameter1: parameter1,
      parameter2: parameter2,
      combindCode2: combindCode2,
    });
  };

  //云台控制请求
  const ptzCamera = async (code: string) => {
  await doPtzPtz({
    deviceId: props.deviceId,
    channelId: props.channelId,
    command: code,
    horizonSpeed: parseInt(props.controSpeed * 255/100),
    verticalSpeed: parseInt(props.controSpeed * 255/100),
    zoomSpeed: parseInt(props.controSpeed * 16/100),
  });
  };
</script>