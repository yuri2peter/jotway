import { getStore } from 'src/store/state';
import { load } from 'cheerio';
import axiosServices from 'src/utils/axios';
import { requestApi } from 'src/utils/request';
import { z } from 'zod';
import { UploadResults } from 'src/components/miscs/NowUploader';
import { SERVER_ORIGIN } from 'src/configs';

export async function parseUrl(
  url: string,
  serverUrl = '',
  timeout = 20000 // ms
) {
  let html = '';
  const u = new URL(url);
  // 获取html
  try {
    if (serverUrl) {
      html = await fetchHtml({ url, server1: serverUrl, server2: '', timeout });
    } else {
      html = await fetchHtml({
        url,
        server1: 'utils/fetch-url',
        server2: getStore().settings.htmlParseServer,
        timeout,
      });
    }
  } catch (error) {
    return {
      title: u.hostname,
      description: url,
      iconLink: '',
      error: true,
      rss: false,
    };
  }
  // TODO RSS解析
  // try {
  // } catch (error) {
  //   // not rss
  // }

  // 常规网页解析
  const $ = load(html);
  const title = $('title').text();
  const description = $('meta[name="description" i]').attr('content') || url;
  const iconLink =
    $('link[rel="icon" i], link[rel="shortcut icon" i]').attr('href') || '';
  return z
    .object({
      description: z.string(),
      title: z.string(),
      iconLink: z.string(),
      error: z.boolean(),
    })
    .parse({
      title,
      description,
      iconLink: iconLink,
      error: false,
    });
}

export async function bingWallpaper() {
  const data = await requestApi('utils/bing-wallpaper');
  return z.object({ url: z.string(), title: z.string() }).parse(data);
}

export async function uploadFileToServer(file: File) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await axiosServices.post(
    SERVER_ORIGIN + '/api/upload',
    form
  );
  return data as UploadResults;
}

export function fetchHtml({
  url,
  server1,
  server2,
  timeout,
}: {
  url: string;
  server1: string;
  server2: string;
  timeout: number;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    requestApi(server1, { url }, { timeout })
      .then(resolve)
      .catch(() => {});
    server2 &&
      requestApi(server2, { url }, { timeout })
        .then(resolve)
        .catch(() => {});
    setTimeout(() => {
      reject();
    }, timeout);
  });
}
