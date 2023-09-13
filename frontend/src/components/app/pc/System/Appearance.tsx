import {
  Box,
  ButtonBase,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
} from '@mui/material';
import React from 'react';
import FormItem from './FormItem';
import { changeStore, useStore } from 'src/store/state';
import WallpaperUploader from '../WallpaperUploader';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { lang } from 'src/components/app/utils';
import { updateLocalLangType } from 'src/store/state/actions/settings';

const Appearance: React.FC<{}> = () => {
  const {
    systemForm: {
      settings: {
        langType,
        wallpaperType,
        customWallpapers,
        customWallpaperUrl,
      },
    },
  } = useStore();
  const isCustom = wallpaperType === 'custom';
  return (
    <Stack spacing={1}>
      <FormItem title={lang('语言', 'Language')} vertical>
        <RadioGroup
          row
          value={langType}
          onChange={(e, v) => {
            changeStore((d) => {
              d.systemForm.settings.langType = v as any;
            });
            updateLocalLangType(v as any);
          }}
        >
          <FormControlLabel value="zh" control={<Radio />} label="中文" />
          <FormControlLabel value="en" control={<Radio />} label="English" />
        </RadioGroup>
      </FormItem>
      <FormItem title={lang('桌面壁纸', 'Wallpaper')} vertical>
        <RadioGroup
          row
          value={wallpaperType}
          onChange={(e, v) => {
            changeStore((d) => {
              d.systemForm.settings.wallpaperType = v as any;
            });
          }}
        >
          <FormControlLabel
            value="bing"
            control={<Radio />}
            label={lang('Bing 每日壁纸', 'Bing Daliy Wallpaper')}
          />
          <FormControlLabel
            value="custom"
            control={<Radio />}
            label={lang('自定义', 'Customized')}
          />
        </RadioGroup>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {customWallpapers.map((t) => {
            const deletable = !t.startsWith('/backgrounds/');
            return (
              <ButtonBase
                key={t}
                onClick={() => {
                  changeStore((d) => {
                    d.appearance.bgImage = t;
                    d.systemForm.settings.customWallpaperUrl = t;
                    d.systemForm.settings.wallpaperType = 'custom';
                  });
                }}
              >
                <Box
                  sx={{
                    border:
                      '2px solid ' +
                      (t === customWallpaperUrl ? 'white' : 'gray'),
                    margin: 0.5,
                    width: 150,
                    height: 80,
                    flexShrink: 0,
                    background: `url(${t}) center/cover`,
                    position: 'relative',
                  }}
                >
                  {deletable && (
                    <Tooltip title={lang('删除', 'Delete')}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          changeStore((d) => {
                            d.systemForm.settings.customWallpapers =
                              d.systemForm.settings.customWallpapers.filter(
                                (v) => v !== t
                              );
                          });
                        }}
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                        }}
                      >
                        <CloseCircleTwoTone />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </ButtonBase>
            );
          })}
          <WallpaperUploader
            disabled={!isCustom}
            onUploaded={(url) =>
              changeStore((d) => {
                d.appearance.bgImage = url;
                d.systemForm.settings.customWallpaperUrl = url;
                d.systemForm.settings.customWallpapers.push(url);
              })
            }
          />
        </Box>
      </FormItem>
    </Stack>
  );
};

export default Appearance;
