import { PropsOf } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';

const FlexFiller: React.FC<PropsOf<typeof Box>> = ({ ...otherProps }) => {
  return <Box flexGrow={1} {...otherProps} />;
};

export default FlexFiller;
