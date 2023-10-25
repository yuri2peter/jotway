// 模态框，受控打开和关闭
import * as React from 'react';
import { Box, Dialog, IconButton, Breakpoint, Typography } from '@mui/material';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { CloseOutlined } from '@ant-design/icons';
import RowStack from './RowStack';
import { glassStyle } from 'src/styles/utils';

const Modal: React.FC<{
  children: React.ReactElement;
  onClose: () => void;
  title: string;
  open: boolean;
  maxWidth?: Breakpoint;
}> = ({ children, onClose, title, open, maxWidth = 'sm' }) => {
  return (
    <Dialog
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}
      sx={{ '& .MuiDialog-paper': { p: 0, ...(glassStyle(0.2) as any) } }}
    >
      {open && (
        <Box sx={{}}>
          <RowStack padding={2} paddingBottom={0}>
            <AspectRatioIcon />
            <Typography sx={{ flexGrow: 1 }} noWrap>
              {title}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseOutlined />
            </IconButton>
          </RowStack>
          <Box padding={3} overflow={'auto'} maxHeight="70vh">
            {children}
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default Modal;
