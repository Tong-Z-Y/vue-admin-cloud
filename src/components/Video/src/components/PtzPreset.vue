<template>
  <div class="flex flex-col flex-auto">
    <div class ="flex-auto h-0 overflow-y-auto">
      <List size="small" :data-source="stats.resetList">
        <template #renderItem="{ item }">
          <ListItem>
            <Tag 
            class="cursor-pointer text-center w-full" 
            closable 
            :color="`${stats.selectPresetId === item.presetId ? '#108ee9' : ''}`"
            @click="handleItemClick(item)"
            @close="handleItemClose(item)"
            >{{ item.presetName }}</Tag>
          </ListItem>
        </template>
      </List>
    </div>
    <div class="flex  select-none justify-center">
      <InputNumber
        v-model:value="stats.presetPositionNo"
        :min="1"
        v-if="stats.isShow"
        :max="255"
      >
        <template #addonBefore> 预设位编号 </template>
        <template #addonAfter>
          <Button @click="handleItemAdd(stats.presetPositionNo)"
            >保存</Button
          >
          <Button @click="()=>{stats.isShow = false}"
            >关闭</Button
          >
        </template>
      </InputNumber>
      <Button v-else @click="()=>{stats.isShow = true}"
            >添加</Button
          >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount,reactive } from 'vue';
  import { doPtzPresetQuery,doPtzPresetDel,doPtzPresetAdd,doPtzPresetCall } from '@/api/video/ptz';
  import {
    Button,
    List,
    Tag,
    ListItem,
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
    isShow: false,
    presetPositionNo: 1, //预设位编号
    selectPresetId: '', //选择预设位编号
    resetList: [] //预设位列表
  })

  onBeforeMount(()=>{
    console.log('PtzPreset')
    apiPtzPresetQuery()
  })

  const apiPtzPresetQuery = async ()=>{
    stats.resetList = await doPtzPresetQuery({deviceId: props.deviceId,channelId: props.channelId})
  }

  //选择预设位
  const handleItemClick = (item) => {
    if(stats.selectPresetId != item.presetId){
      stats.selectPresetId = item.presetId;
      doPtzPresetCall({deviceId: props.deviceId,channelId: props.channelId,presetId: item.presetId})
    }
  };
  //删除预设位
  const handleItemClose = async(item) => {
    if(stats.selectPresetId == item.presetId){
      stats.selectPresetId = '0';
    }
    await doPtzPresetDel({deviceId: props.deviceId,channelId: props.channelId,presetId: item.presetId});
    await apiPtzPresetQuery()
  };
   //删除预设位
   const handleItemAdd = async(presetId) => {
    await doPtzPresetAdd({deviceId: props.deviceId,channelId: props.channelId,presetId: presetId});
    await apiPtzPresetQuery()
    stats.isShow = false
    stats.selectPresetId = '0'
  };

</script>