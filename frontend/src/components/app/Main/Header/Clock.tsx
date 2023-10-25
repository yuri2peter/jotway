import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useTimer } from 'src/hooks/useTimer';
import { useSelector } from 'src/store/state';
import {
  selectIsMobile,
  selectTagMenuWidth,
} from 'src/store/state/defaultStore';

const Clock: React.FC<{}> = () => {
  const now = useTimer(1000);
  const tagMenuWidth = useSelector(selectTagMenuWidth);
  const isMobile = useSelector(selectIsMobile);
  if (isMobile) {
    return null;
  }
  return (
    <Stack
      spacing={0}
      width={tagMenuWidth}
      sx={{ marginLeft: -1, flexShrink: 0 }}
    >
      <Typography align="center" variant="h5" fontWeight={'bold'}>
        {dayjs(now).format('HH:mm:ss')}
      </Typography>
      <Typography align="center" variant="caption">
        {dayjs(now).format('MM-DD dddd a')}
      </Typography>
    </Stack>
  );
};

export default Clock;
