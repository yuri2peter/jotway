import { appVersion, githubHref } from '@local/common';
import { Box, Typography } from '@mui/material';
import React from 'react';
import FlexFiller from 'src/components/FlexFiller';
import RowStack from 'src/components/RowStack';

const Footer: React.FC<{}> = () => {
  return (
    <RowStack width={1} justifyContent={'center'} sx={{ zIndex: 1 }}>
      <FlexFiller />
      <Typography variant="caption">
        <Box
          component={'a'}
          href={githubHref}
          target="_blank"
          sx={{
            textDecoration: 'underline',
            color: 'inherit',
          }}
        >
          Jotway v{appVersion}
        </Box>
      </Typography>
    </RowStack>
  );
};

export default Footer;
