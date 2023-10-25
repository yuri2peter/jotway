import { Box, Paper, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import CentralBox from 'src/components/miscs/CentralBox';
import { config } from '../config';

const debug = false;
let visible = true;

const Storyboard: React.FC = () => {
  const [show, setShow] = useState(true);
  const close = useCallback(() => {
    if (debug) {
      return;
    }
    setShow(false);
    visible = false;
  }, []);
  useEffect(() => {
    const t = setTimeout(close, 2500);
    return () => {
      clearTimeout(t);
    };
  }, [close]);
  if (!show || !visible || !config.showStoryboard) {
    return null;
  }
  return (
    <Paper
      onClick={close}
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999,
      }}
      className={
        debug
          ? ''
          : 'animate__animated animate__fadeOut animate__delay-2s animate__faster'
      }
    >
      <CentralBox
        sx={{
          height: '100%',
          alignItems: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <img
            src={'/logos/512.png'}
            title="logo"
            width={140}
            style={{
              borderRadius: 16,
              // boxShadow: '2px 2px 8px rgb(0 0 0 / 50%)',
            }}
          />
          <Box height={24}></Box>
          <Typography
            variant="h5"
            // sx={{ textShadow: '2px 2px 4px rgb(0 0 0 / 50%)' }}
          >
            Jotway
          </Typography>
        </Stack>
      </CentralBox>
    </Paper>
  );
};

export default Storyboard;
