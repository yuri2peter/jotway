import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useTimer } from 'src/hooks/useTimer';

const Clock: React.FC<{}> = () => {
  const now = useTimer(1000);
  return (
    <Typography align="center" variant="caption">
      {dayjs(now).format('MM-DD dddd a hh:mm:ss')}
    </Typography>
  );
};

export default Clock;
