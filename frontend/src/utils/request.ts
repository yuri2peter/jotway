import { SERVER_ORIGIN } from 'src/configs';
import axiosServices from './axios';
import { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

export async function requestApi(
  path: string,
  params = {},
  configs: AxiosRequestConfig<{}> = {}
) {
  const defaultConfigs: AxiosRequestConfig = {};
  const { data } = await axiosServices.post(
    path.startsWith('http') ? path : SERVER_ORIGIN + '/api/' + path,
    params,
    merge(configs, defaultConfigs)
  );
  return data;
}
