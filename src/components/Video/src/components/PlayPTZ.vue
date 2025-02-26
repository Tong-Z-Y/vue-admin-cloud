<template>
  <div :class="`${prefixCls} select-none`">
    <Divider>云台控制</Divider>
    <div class="flex flex-col space-y-3">
      <div class="flex flex-col space-y-1">
        <div>
          <InputNumber
            v-model:value="stats.presetPositionNo"
            :min="1"
            :max="255"
            size="small"
          >
            <template #addonBefore> 预设位编号 </template>
            <template #addonAfter>
              <Button size="small" @click="ptzCommand(129, 0, stats.presetPositionNo, 0)"
                >设置</Button
              >
            </template>
          </InputNumber>
        </div>
        <div class="flex flex-row">
          <Button
            class="flex-1"
            @click="ptzCommand(131, 0, stats.presetPositionNo, 0)"
            size="small"
            >删除</Button
          >
          <Button
            type="primary"
            class="flex-1"
            @click="ptzCommand(130, 0, stats.presetPositionNo, 0)"
            size="small"
            >调用</Button
          >
        </div>
      </div>
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
                    Math.floor(stats.scanSpeed / 256) * 16,
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
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { doPtzPtz,doPtzFrontEndCommand } from '@/api/video/ptz';
  import {
    Button,
    Divider,
    InputNumber
  } from 'ant-design-vue';

  const { prefixCls } = useDesign('video-play-model-right-ptz');
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
    presetPositionNo: 1, //预设位编号
    cruiseGroupNo: 1, //巡航组编号
    ruiseSpeed: 1, //巡航速度
    ruiseResidenceTime: 1, //巡航停留时间
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