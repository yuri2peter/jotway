import { PropsOf } from '@emotion/react';
import { Stack } from '@mui/material';
import React from 'react';

const RowStack: React.FC<PropsOf<typeof Stack>> = ({ ...otherProps }) => {
  return (
    <Stack alignItems="center" direction="row" spacing={1} {...otherProps} />
  );
};

export default RowStack;
