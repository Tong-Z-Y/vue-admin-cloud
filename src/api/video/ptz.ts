import { defHttp } from '@/utils/http/axios';

enum Api {
  //云台方向控制
  ptz = '/webapi/video/ptz/ptz',
  //聚焦控制
  focus = '/webapi/video/ptz/focus',
  //光圈控制
  iris = '/webapi/video/ptz/iris',
  //云台指令控制
  frontEndCommand = '/webapi/video/ptz/front_end_command',
  //预置位查询
  presetQuery = '/webapi/video/ptz/preset_query',
  //预置位删除
  presetDel = '/webapi/video/ptz/del_preset',
  //设置预置位
  presetAdd = '/webapi/video/ptz/add_preset',
  //调用预置位
  presetCall = '/webapi/video/ptz/call_preset',

  //加入巡航点
  cruisePointAdd = '/webapi/video/ptz/add_cruise_point',
  //删除一个巡航点
  cruisePointDel = '/webapi/video/ptz/del_cruise_point',
  //设置巡航速度
  cruisePointSpeed = '/webapi/video/ptz/speed_cruise_point',
  //设置巡航停留时间
  cruisePointTime = '/webapi/video/ptz/time_cruise_point',
  //开始巡航
  cruisePointStart = '/webapi/video/ptz/start_cruise_point',
  //停止巡航
  cruisePointStop = '/webapi/video/ptz/stop_cruise_point',

  //开始自动扫描
  scanStart = '/webapi/video/ptz/start_scan',
  //停止自动扫描
  scanStop = '/webapi/video/ptz/stop_scan',
  //设置自动扫描左边界
  scanSetLeft = '/webapi/video/ptz/set_left_scan',
  //设置自动扫描右边界
  scanSetRight = '/webapi/video/ptz/set_right_scan',
  //设置自动扫描速度
  scanSetSpeed = '/webapi/video/ptz/set_speed_scan',

  //雨刷控制
  wiper = '/webapi/video/ptz/wiper',

  //辅助控制
  auxiliary = '/webapi/video/ptz/auxiliary',
}

export function doPtzPtz(params: Recordable) {
  return defHttp.get({ url: Api.ptz, params });
}
export function doPtzFocus(params: Recordable) {
  return defHttp.get({ url: Api.focus, params });
}
export function doPtzIris(params: Recordable) {
  return defHttp.get({ url: Api.iris, params });
}
export function doPtzFrontEndCommand(params: Recordable) {
  return defHttp.get({ url: Api.frontEndCommand, params });
}
export function doPtzPresetQuery(params: Recordable) {
  return defHttp.get({ url: Api.presetQuery, params });
}
export function doPtzPresetDel(params: Recordable) {
  return defHttp.get({ url: Api.presetDel, params });
}
export function doPtzPresetAdd(params: Recordable) {
  return defHttp.get({ url: Api.presetAdd, params });
}
export function doPtzPresetCall(params: Recordable) {
  return defHttp.get({ url: Api.presetCall, params });
}

export function doCruisePointAdd(params: Recordable) {
  return defHttp.get({ url: Api.cruisePointAdd, params });
}
export function doCruisePointDel(params: Recordable) {
  return defHttp.get({ url: Api.cruisePointDel, params });
}
export function doCruisePointSpeed(params: Recordable) {
  return defHttp.get({ url: Api.cruisePointSpeed, params });
}
export function doCruisePointTime(params: Recordable) {
  return defHttp.get({ url: Api.cruisePointTime, params });
}
export function doCruisePointStart(params: Recordable) {
  return defHttp.get({ url: Api.cruisePointStart, params });
}
export function doCruisePointStop(params: Recordable) {
  return defHttp.get({ url: Api.cruisePointStop, params });
}

export function doScanStart(params: Recordable) {
  return defHttp.get({ url: Api.scanStart, params });
}
export function doScanStop(params: Recordable) {
  return defHttp.get({ url: Api.scanStop, params });
}
export function doScanSetLeft(params: Recordable) {
  return defHttp.get({ url: Api.scanSetLeft, params });
}
export function doScanSetRight(params: Recordable) {
  return defHttp.get({ url: Api.scanSetRight, params });
}
export function doScanSetSpeed(params: Recordable) {
  return defHttp.get({ url: Api.scanSetSpeed, params });
}

export function doWiper(params: Recordable) {
  return defHttp.get({ url: Api.wiper, params });
}

export function doAuxiliary(params: Recordable) {
  return defHttp.get({ url: Api.auxiliary, params });
}