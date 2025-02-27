<template>
  <div class="flex flex-col space-y-1">
    <div>
      <InputNumber v-model:value="stats.ruiseSpeed" :min="1" :max="4095" size="small">
        <template #addonBefore> 巡航速度 </template>
        <template #addonAfter>
          <Button
            size="small"
            @click="
              ptzCommand(
                134,
                stats.cruiseGroupNo,
                stats.ruiseSpeed % 256,
                Math.floor(stats.ruiseSpeed / 256) * 16,
              )
            "
            >设置</Button
          >
        </template>
      </InputNumber>
      <InputNumber
        v-model:value="stats.ruiseResidenceTime"
        :min="1"
        :max="4095"
        size="small"
      >
        <template #addonBefore> 停留时间 </template>
        <template #addonAfter>
          <Button
            size="small"
            @click="
              ptzCommand(
                135,
                stats.cruiseGroupNo,
                stats.ruiseResidenceTime % 256,
                Math.floor(stats.ruiseResidenceTime / 256) * 16,
              )
            "
            >设置</Button
          >
        </template>
      </InputNumber>
      <InputNumber v-model:value="stats.cruiseGroupNo" :min="1" :max="255" size="small">
        <template #addonBefore> 巡航组编号 </template>
      </InputNumber>
    </div>
    <div class="flex flex-row">
      <Button
        class="flex-1"
        size="small"
        @click="ptzCommand(132, stats.cruiseGroupNo, stats.presetPositionNo, 0)"
        >添加点</Button
      >
      <Button
        class="flex-1"
        size="small"
        @click="ptzCommand(133, stats.cruiseGroupNo, stats.presetPositionNo, 0)"
      >
        删除点</Button
      >
      <Button
        class="flex-1"
        size="small"
        @click="ptzCommand(133, stats.cruiseGroupNo, 0, 0)"
        >删除组</Button
      >
      <Button
        type="primary"
        size="small"
        class="flex-1"
        @click="ptzCommand(136, stats.cruiseGroupNo, 0, 0)"
        >巡航</Button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { doPtzFrontEndCommand } from '@/api/video/ptz';
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
  });

  const stats = reactive({
    cruiseGroupNo: 1, //巡航组编号
    presetPositionNo:1, //预设位编号
    ruiseSpeed: 1, //巡航速度
    ruiseResidenceTime: 1, //巡航停留时间
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
</script>