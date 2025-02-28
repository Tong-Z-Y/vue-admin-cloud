<template>
  <div class="flex flex-col space-y-1">
    <div class="flex flex-row p-t-2">
      <InputNumber v-model:value="stats.switchId" :min="1" :max="4095" >
        <template #addonBefore> 辅助编号 </template>
      </InputNumber>
    </div>
    <div class="flex flex-row">
      <Button
        type="primary"
        class="flex-1"
        @click="doAuxiliary({deviceId: props.deviceId,channelId: props.channelId,command: 'on',switchId: stats.switchId})"
        >开启</Button
      >
      <Button type="primary" danger class="flex-1" @click="doAuxiliary({deviceId: props.deviceId,channelId: props.channelId,command: 'off',switchId: stats.switchId})"
        >关闭</Button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { doAuxiliary } from '@/api/video/ptz';
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
    }
  });

  const stats = reactive({
    switchId: "",//辅助功能编号
  })
</script>