import { Button, Stack, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import SyncIcon from '@mui/icons-material/Sync';
import { changeStore, useStore } from 'src/store/state';
import { parseUrl } from 'src/api/utils';
import {
  FormItem,
  FormItemName,
  FormItemTags,
  FormItemDesc,
  FormAction,
} from './parts';
import RowStack from 'src/components/RowStack';
import { lang } from 'src/components/app/utils';

const UrlForm: React.FC<{}> = () => {
  const {
    linkerForm: { linker },
  } = useStore();
  const { url, icon } = linker;
  const [parsing, setParsing] = useState(false);
  return (
    <Stack spacing={2} justifyContent={'stretch'}>
      <FormItem title={lang('网址', 'URL')}>
        <RowStack width={1} spacing={2}>
          <TextField
            value={url}
            multiline
            fullWidth
            onChange={(e) => {
              changeStore((d) => {
                d.linkerForm.linker.url = e.target.value;
              });
            }}
          />
          <Tooltip
            title={lang(
              '解析图标、名称、简述等字段',
              'Parse fields such as icon, name, and description.'
            )}
          >
            <Button
              variant="outlined"
              disabled={parsing}
              onClick={() => {
                setParsing(true);
                parseUrl(url)
                  .then(({ title, description, iconLink }) => {
                    changeStore((d) => {
                      d.linkerForm.linker.name = title;
                      d.linkerForm.linker.desc = description;
                      d.linkerForm.linker.icon = iconLink;
                    });
                  })
                  .finally(() => {
                    setParsing(false);
                  });
              }}
              sx={{ flexShrink: 0, paddingY: '7px' }}
              startIcon={<SyncIcon />}
            >
              {lang('网址解析', 'Parse')}
            </Button>
          </Tooltip>
        </RowStack>
      </FormItem>
      <FormItem title={lang('图标', 'Icon')}>
        <TextField
          fullWidth
          value={icon}
          multiline
          onChange={(e) => {
            changeStore((d) => {
              d.linkerForm.linker.icon = e.target.value;
            });
          }}
        />
      </FormItem>
      <FormItemName />
      <FormItemTags />
      <FormItemDesc />
      <FormAction />
    </Stack>
  );
};

export default UrlForm;
