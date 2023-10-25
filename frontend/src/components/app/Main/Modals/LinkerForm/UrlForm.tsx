import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import SyncIcon from '@mui/icons-material/Sync';
import { changeStore, getStore, useStore } from 'src/store/state';
import { parseUrl } from 'src/api/utils';
import {
  FormItem,
  FormItemName,
  FormItemTags,
  FormItemDesc,
  FormAction,
} from './parts';
import RowStack from 'src/components/miscs/RowStack';
import { lang } from 'src/components/app/utils';
import { useSelector } from 'src/store/state';
import { selectIsMobile } from 'src/store/state/defaultStore';
import LinkerIcon from '../../../miscs/LinkerIcon';
import { useInitValue } from 'src/hooks/useInitValue';

const UrlForm: React.FC<{}> = () => {
  const {
    linkerForm: { linker, create },
  } = useStore();
  const { url, icon } = linker;
  const initUrl = useInitValue(url);
  const refInputUrl = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const isMobile = useSelector(selectIsMobile);
  const handleSync = () => {
    setParsing(true);
    parseUrl(getStore().linkerForm.linker.url)
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
  };
  useEffect(() => {
    if (!initUrl) {
      refInputUrl.current?.focus();
    } else {
      // 如果是新建模式，则自动解析url
      if (create) {
        handleSync();
      }
    }
  }, [create, initUrl]);
  const btnParseTooltip = lang(
    '解析图标、名称、简述等字段',
    'Parse fields such as icon, name, and description.'
  );
  return (
    <Stack spacing={2} justifyContent={'stretch'}>
      <FormItem title={lang('网址', 'URL')}>
        <RowStack width={1} spacing={2}>
          <TextField
            inputRef={refInputUrl}
            value={url}
            multiline={!isMobile}
            fullWidth
            onPaste={() => {
              // 粘贴网址自动解析
              setTimeout(() => {
                handleSync();
              }, 100);
            }}
            onChange={(e) => {
              changeStore((d) => {
                d.linkerForm.linker.url = e.target.value;
              });
            }}
            InputProps={{
              endAdornment: isMobile && (
                <Tooltip title={btnParseTooltip}>
                  <IconButton color="primary" onClick={handleSync}>
                    <SyncIcon />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
          {!isMobile && (
            <Tooltip title={btnParseTooltip}>
              <Button
                variant="outlined"
                disabled={parsing}
                onClick={handleSync}
                sx={{ flexShrink: 0, paddingY: '7px' }}
                startIcon={<SyncIcon />}
              >
                {parsing
                  ? lang('解析中', 'Parsing...')
                  : lang('网址解析', 'Parse Url')}
              </Button>
            </Tooltip>
          )}
        </RowStack>
      </FormItem>
      <FormItemName />
      <FormItem title={lang('图标', 'Icon')}>
        <TextField
          fullWidth
          value={icon}
          multiline={!isMobile}
          onChange={(e) => {
            changeStore((d) => {
              d.linkerForm.linker.icon = e.target.value;
            });
          }}
          InputProps={{
            startAdornment: (
              <Box mr={1}>
                <LinkerIcon linker={linker} size={24} />
              </Box>
            ),
          }}
        />
      </FormItem>
      <FormItemTags />
      <FormItemDesc />
      <FormAction />
    </Stack>
  );
};

export default UrlForm;
