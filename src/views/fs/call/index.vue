<template>
  <div>
    <div>
      <Row :gutter="24">
        <Col :span="24">拨打状态：{{ pushStats.videoEnable?'视频电话': '音频电话'}}</Col>
        <Col :span="24">客服名称：{{ agentStats.agentName }}</Col>
        <Col :span="24">客服客服账号：{{ agentStats.agentKey }}</Col>
        <Col :span="24">客服客服工号：{{ agentStats.agentId }}</Col>
        <Col :span="24">客服登录类型：{{ agentStats.loginType }}</Col>
        <Col :span="24">客服状态：{{ agentStats.agentState }}</Col>
        <Col :span="24">客服推流地址：{{ agentStats.mediaAddress }}</Col>
      </Row>
    </div>
    <div :class="`${prefixCls}-left bg-black grid row-span-15`">
      <VideoZlmRtcPlay :videoUrl="stats.zlmVideoRtcUrl" :hasAudio="true" :muted="false"/>
    </div>
    <div :class="`${prefixCls}-left bg-black grid row-span-15`">
      <VideoZlmRtcPlay :videoUrl="stats.zlmAudioRtcUrl" :hasAudio="true" :muted="false"/>
    </div>
    <BasicForm @register="register" />
    <Button size="small"   @click="handleOk">拨打</Button>
    <Button size="small"   @click="handleHangUp">挂机</Button>
    <Switch size="small"    v-model:checked="pushStats.videoEnable" />
    <Button size="small"   @click="handleAgentStats">更新客服状态</Button>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, unref,onBeforeMount,onUnmounted } from 'vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import rootSocketEmitter from '@/hooks/socket/rootSocketEmitter';
  import {
    SocketNamespace,
    SocketInEvent,
    SocketOutEvent,
    ResultEnum,
  } from '@/enums/SocketEnum';
  import { Button,Row,Col,Switch } from 'ant-design-vue';
  import { useSocketStore } from '@/store/modules/socket';
  import { useDesign } from '@/hooks/web/useDesign';
  import VideoZlmRtcPlay from '@/components/Video/src/VideoZlmRtcPlay.vue';
  import { useFsSocket } from '@/hooks/socket';
  import { useMessage} from '@/hooks/web/useMessage';
  import { useZlmRtc } from '@/components/Video';
  import { useUserStore } from '@/store/modules/user';
  import { setObjToUrlParams } from '@/utils';
  import { isEmpty } from '@/utils/is';

  const emit = defineEmits(['success', 'register']);
  const useSocket = useSocketStore();
  const userStore = useUserStore();
  const { createMessage,createConfirm } = useMessage();
  const { prefixCls } = useDesign('video-play');

  const stats = reactive({
    caller :'',
    status : 0,//0.未登录 1.已登陆
    timeout : null as any,//超时定时器
    zlmAudioRtcUrl:'',
    zlmVideoRtcUrl:'',
    direction : 1,//呼叫方式 1.呼入 2.呼出
    inCallRingConfirm : {} as any,
  })

  const agentStats = reactive({
    agentState: '',//坐席状态
    agentName: '',//坐席名称
    agentKey: '',//坐席账户
    agentId: '',//坐席工号
    mediaAddress: '',//分配的流媒体地址（推送用）
    loginType: '',//登录方式
  });

  const pushStats = reactive({
    zlmsdpUrl: '',
    audioEnable: true,
    videoEnable: true,
    recvOnly: false,
    debug: true,
	  useCamera: true,
  });

  const schemas: FormSchema[] = [
    {
      field: 'caller',
      component: 'Input',
      label: '被叫号码',
      colProps: {
        span: 12,
      },
      required: true,
    },
  ]

  const [register, {validate }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
  });

  const sendMessage = ()=>{
    if(stats.status == 0){
        createMessage.error('客服未登录');
        return;
    }else if(stats.status == 1){
        createMessage.info('客服登陆成功');
        return;
    }else if(stats.status == 2){
        createMessage.info('正在获取推流地址，请稍后');
        return;
    }else if(stats.status == 3){
        createMessage.info('正在推流请稍后');
        return;
    }else if(stats.status == 4){
        createMessage.info('拨打电话中请稍后。。。');
        return;
    }
  }

  const handleAgentStats = ()=>{
     //登录成功后 请求坐席信息
     useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_STATUS, {
      updateStatus: 1,//是否更新信息坐席状态 默认不更新
    });
  }

  //语音对讲
  const { success, destroy } = useZlmRtc(pushStats); //加载 webrtc 语音对讲配置

  const handleOk = async ()=>{
    if(!unref(success)){
        createMessage.error('webrtp加载失败');
        return;
      }
    const { caller } =await validate();
    //开始执行流程
    if(stats.status != 1){
      sendMessage();
      return;
    }
    if(!caller){
      createMessage.error('请输入号码');
      return;
    }else if(isEmpty(agentStats.mediaAddress)){
      createMessage.error('未获取推流地址');
      return;
    }
    stats.direction = 1;
    stats.caller = caller;
    stats.status = 2;
    sendMessage();
    stats.timeout = setTimeout(()=>{
      stats.status = 1;
      destroy();
      createMessage.error('获取推流地址超时');
      stats.timeout && clearInterval(stats.timeout);
    },15000)
    //开始推流
    pushStats.zlmsdpUrl =authUrl(setObjToUrlParams(agentStats.mediaAddress,{app:'PUSH_RTP_STREAM',stream:(pushStats.videoEnable?'PUSH_VIDEO_RTP_STREAM:':'PUSH_AUDIO_RTP_STREAM:')+agentStats.agentKey,type:'push'})) as string;
    stats.status = 3;//开始推流中
    sendMessage();
  }

  const authUrl = (url) => {
    return setObjToUrlParams(url, { token: userStore.getToken });
  };

  const hangUp = ()=>{
    //关闭推流
    stats.status = 1;//拨打电话
    destroy();
    stats.direction = 1;//默认呼出
    stats.zlmAudioRtcUrl = '';
    stats.zlmVideoRtcUrl = '';
    stats.inCallRingConfirm = {}
  }
  const handleHangUp = () =>{
    //发送挂机命令
    useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_HANG_UP_PHONE, {});
  }

  onBeforeMount(()=>{
    //进入页面加载客服socket
    useFsSocket('ws://192.168.1.5:9092/','/socket.io');
    //登陆成功回调
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_STATUS);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_LOGIN);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_PUSH_PATH);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_PUSH_PATH_LOGOUT);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION);
    
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_LOGIN, (val) => {
      const { code, message } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      stats.status = 1;
      sendMessage();
      //登录成功后 请求坐席信息
      useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_STATUS, {
        updateStatus: 0,//是否更新信息坐席状态 默认不更新
      });
    });
    //客服信息回调
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_STATUS, (val) => {
      const { code, message, data } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      const {agentState,agentName,agentKey,agentId,mediaAddress,loginType} = data as Recordable;
      agentStats.agentState =agentState;
      agentStats.agentName = agentName;
      agentStats.agentKey = agentKey;
      agentStats.agentId = agentId;
      agentStats.mediaAddress = mediaAddress;
      agentStats.loginType = loginType;
      createMessage.info(message);
    });

    //客服推流成功回调
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_PUSH_PATH, (val) => {
      const { code, message } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        stats.status = 1;
        createMessage.error(message || '获取消息错误');
        stats.timeout && clearInterval(stats.timeout);
        return;
      }
      stats.timeout && clearInterval(stats.timeout);
      stats.status = 4;//拨打电话
      sendMessage();
      //判断 是 主动拨号 还是 被动
      if(stats.direction == 1){//呼出
         //开始拨号
        useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_CALL_PHONE, {
          caller: stats.caller,//拨打号码
          type:pushStats.videoEnable?'CALL_VIDEO_PHONE':'CALL_AUDIO_PHONE',
        });
      }else{//呼入
        const keys =  Object.keys(stats.inCallRingConfirm);
        if(!keys || keys.length == 0){
          createMessage.error('未获取来电 callId 信息');
          return
        }
        //开始拨号
        useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_PHONE_NOTIFICATION, {
          type:2,
          callId: keys[0],//拨打号码
          onVideo:pushStats.videoEnable?1:0,
        });
      }
    });
    //客服拨打电话回调
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_CALL_PHONE, (val) => {
      const { code, message, data } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        hangUp();
        createMessage.error(message || '获取消息错误');
        return;
      }
      const tracks = data?.tracks as Array<Recordable>;
      const trackCount = tracks.filter(o=>o.codecType == 0).length;//查看是否有视频
      if(trackCount > 0){
        stats.zlmVideoRtcUrl = authUrl(data?.rtc?.url) as any
        createMessage.info('视频成功');
      }else{
        stats.zlmAudioRtcUrl = authUrl(data?.rtc?.url) as any
        createMessage.info('音频成功');
      }
    });
    //接收挂机回调
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE, (val) => {
      const { code, message } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      hangUp();
      createMessage.info(message || '获取消息错误');
    });
    //客服事件消息
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION, (val) => {
      const { code, message , data} = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        Object.keys(stats.inCallRingConfirm).forEach(o=>{
          stats.inCallRingConfirm[o].destroy();
        })
        hangUp();
        return;
      }
      //各种事件处理
      handleNotification(data);
    });
  })
  //开始处理回调事件
  const handleNotification = ({agentState,callId,callType,called,caller,direction,groupId,onVideo}) =>{
    switch(callType){
      case "INNER_CALL"://呼入来电振铃
        handleInCallRing(callId,called,caller,onVideo);
        break;
      default:
        console.log("暂不支持此类型事件：",callType);
    }
  }
  //呼入来电处理
  const handleInCallRing = (callId,called,caller,onVideo) =>{
    if(stats.inCallRingConfirm[callId]){
      return;
    }
    pushStats.videoEnable = onVideo ===1;
    stats.direction = 2;
    stats.inCallRingConfirm[callId] = createConfirm({
      iconType: 'warning',
      title: () => '来电呼叫',
      content: () => '号码：'+called,
      okText:'接听',
      onOk: () => {
        if(isEmpty(agentStats.mediaAddress)){
          createMessage.error('未获取推流地址');
          return;
        }
        stats.status = 2;
        sendMessage();
        stats.timeout = setTimeout(()=>{
          stats.status = 1;
          destroy();
          createMessage.error('获取推流地址超时');
          stats.timeout && clearInterval(stats.timeout);
        },15000)
        //开始推流
        pushStats.zlmsdpUrl =authUrl(setObjToUrlParams(agentStats.mediaAddress,{app:'PUSH_RTP_STREAM',stream:(pushStats.videoEnable?'PUSH_VIDEO_RTP_STREAM:':'PUSH_AUDIO_RTP_STREAM:')+agentStats.agentKey,type:'push'})) as string;
        stats.status = 3;//开始推流中
        sendMessage();
      },
      cancelText:'拒绝',
      onCancel: ()=>{
        useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_PHONE_NOTIFICATION, {
          type:1,
          callId,
          onVideo:pushStats.videoEnable?1:0,
        });
        hangUp();
        createMessage.success('已拒接');
      }
    })
  }
  onUnmounted(()=>{
    hangUp();
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-video-play';
  .@{prefix-cls} {
    min-height: 380px;
    &-left {
      width: 500px;
    }
  }

</style>