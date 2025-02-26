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
