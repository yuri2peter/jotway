import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { lang } from './utils';

const githubHref = 'https://github.com/yuri2peter/jotway';

const AuthFooter: React.FC<{}> = () => {
  return (
    <>
      {lang(
        <Typography
          variant="body1"
          color={'text.secondary'}
          textAlign={'center'}
          fontSize={13}
        >
          如果你在使用中遇到问题，请到
          <Box component={'a'} href={githubHref} target="_blank">
            社区
          </Box>
          进行反馈
        </Typography>,
        <Typography
          variant="body1"
          textAlign={'center'}
          color={'text.secondary'}
          fontSize={13}
        >
          If you encounter problems, please report it on{' '}
          <Box component={'a'} href={githubHref} target="_blank">
            GitHub
          </Box>
        </Typography>
      )}
    </>
  );
};

export default AuthFooter;
