<template>
  <div class="flex flex-col space-y-1">
    <div class="flex flex-row p-t-2">
      <Button
        type="primary"
        size="small"
        class="flex-1"
        @click="doWiper({deviceId: props.deviceId,channelId: props.channelId,command: 'on'})"
        >开启</Button
      >
      <Button type="primary" size="small" danger class="flex-1" @click="doWiper({deviceId: props.deviceId,channelId: props.channelId,command: 'off'})"
        >关闭</Button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { doWiper } from '@/api/video/ptz';
  import {
    Button
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
</script>