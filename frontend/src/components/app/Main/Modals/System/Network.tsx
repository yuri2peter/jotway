// 网络功能
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import React, { useState } from 'react';
import { parseUrl } from 'src/api/utils';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { z } from 'zod';
import { clamp, now } from 'lodash';
import FormItem from './FormItem';
import { changeStore, useStore } from 'src/store/state';
import { lang } from 'src/components/app/utils';

const Network: React.FC<{}> = () => {
  const {
    systemForm: { settings },
  } = useStore();
  const [parsing, setParsing] = useState(false);
  return (
    <Stack spacing={2}>
      <FormItem vertical title={lang('网址解析', 'URL Parsing')}>
        <TextField
          placeholder={lang(
            '留空则使用默认服务',
            'If left blank, the default service will be used.'
          )}
          fullWidth
          error={
            !z
              .union([z.string().url(), z.literal('')])
              .safeParse(settings.htmlParseServer).success
          }
          value={settings.htmlParseServer}
          onChange={(e) => {
            const v = e.target.value;
            changeStore((d) => {
              d.systemForm.settings.htmlParseServer = v;
            });
          }}
          // 可用性测试
          InputProps={{
            endAdornment: (
              <IconButton
                color="primary"
                disabled={parsing}
                onClick={async () => {
                  setParsing(true);
                  snackbarMessage(
                    lang(
                      '正在测试解析效果，请稍候',
                      'Testing parsing effectiveness, please wait.'
                    ),
                    'info'
                  );
                  (async () => {
                    const time1 = now();
                    const { title, error } = await parseUrl(
                      'https://www.baidu.com',
                      settings.htmlParseServer,
                      settings.htmlParseTimeoutSeconds * 1000
                    );
                    if (error || !title.includes('百度')) {
                      snackbarMessage(
                        lang(
                          '解析 baidu.com 失败',
                          'Failed to resolve baidu.com.'
                        ),
                        'warning'
                      );
                    } else {
                      const s = Math.round((now() - time1) / 100) / 10;
                      snackbarMessage(
                        lang(
                          `解析 baidu.com 成功，用时${s}秒`,
                          `Successfully analyzed baidu.com. Took ${s} seconds.`
                        ),
                        'success'
                      );
                    }
                  })();
                  (async () => {
                    const time1 = now();
                    const { title, error } = await parseUrl(
                      'https://www.google.com',
                      settings.htmlParseServer,
                      settings.htmlParseTimeoutSeconds * 1000
                    );
                    if (error || !title.includes('Google')) {
                      snackbarMessage(
                        lang(
                          '解析 google.com 失败',
                          'Failed to resolve google.com.'
                        ),
                        'warning'
                      );
                    } else {
                      const s = Math.round((now() - time1) / 100) / 10;
                      snackbarMessage(
                        lang(
                          `解析 google.com 成功，用时${s}秒`,
                          `Successfully analyzed google.com. Took ${s} seconds.`
                        ),
                        'success'
                      );
                    }
                  })();

                  setParsing(false);
                }}
              >
                <SyncIcon />
              </IconButton>
            ),
          }}
        />
      </FormItem>
      <FormItem vertical title={lang('网址解析超时', 'Parsing Timeout')}>
        <TextField
          placeholder=""
          fullWidth
          value={settings.htmlParseTimeoutSeconds}
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {lang('秒', 'Seconds')}
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            const v = Number(e.target.value);
            changeStore((d) => {
              d.systemForm.settings.htmlParseTimeoutSeconds = clamp(
                Math.floor(v),
                1,
                20
              );
            });
          }}
        />
      </FormItem>
    </Stack>
  );
};

export default Network;
