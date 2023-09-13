import axios from 'axios';
import { lang } from './lang';

// 获取url的html
export async function fetchHtml(url: string) {
  const { data: html } = await axios.get(url, {
    timeout: 20000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': lang('en;q=0.9, zh;q=0.8', 'zh;q=0.9, en;q=0.8'),
    },
  });
  return html;
}
