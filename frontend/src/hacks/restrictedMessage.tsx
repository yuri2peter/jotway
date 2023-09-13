// 全屏消息
import React, { useCallback, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useImmer } from 'src/hooks/useImmer';
import { glassStyle } from 'src/styles/utils';
import { lang } from 'src/components/app/utils';

interface Params {
  open?: boolean;
  title?: string;
  content?: string;
  closeable?: boolean;
}

const defaultFc: ({
  open,
  title,
  content,
  closeable,
}: Params) => void = () => {};
const refHack = {
  current: defaultFc,
};

interface DialogProps {
  open: boolean;
  title: string;
  content: string;
  onCancle: () => void;
  closeable?: boolean;
}

export const RestrictedMessageHack: React.FC<{}> = () => {
  const [dialogProps, changeDialogProps] = useImmer<DialogProps>({
    open: false,
    title: '',
    content: '',
    closeable: false,
    onCancle: () => {},
  });
  const refCloseable = useRef<boolean>(false);
  refCloseable.current = !!dialogProps.closeable;
  const handleClose = useCallback(() => {
    refCloseable.current &&
      changeDialogProps((d) => {
        d.open = false;
      });
  }, [changeDialogProps]);
  const setMessage = useCallback(
    (p: Params) => {
      changeDialogProps((d) => {
        Object.assign(
          d,
          {
            open,
            onCancle: () => {
              handleClose();
            },
          },
          p
        );
      });
    },
    [changeDialogProps, handleClose]
  );
  refHack.current = setMessage;
  return <PromptDialog {...dialogProps} />;
};

export function restrictedMessage(params: Params = {}) {
  return refHack.current(params);
}

const PromptDialog: React.FC<DialogProps> = ({
  open,
  title,
  content,
  onCancle,
  closeable,
}) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onCancle}
      fullWidth
      maxWidth="xs"
      sx={{ '& .MuiDialog-paper': { p: 0, ...(glassStyle(0.2) as any) } }}
    >
      <Box sx={{ p: 1, py: 1.5 }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Grid item>
            <DialogTitle fontSize={16}>{title}</DialogTitle>
          </Grid>
          <Grid item sx={{ mr: 1.5 }}>
            <IconButton disabled={!closeable} onClick={onCancle}>
              <CloseOutlined />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button
            disabled={!closeable}
            variant="contained"
            onClick={() => {
              onCancle();
            }}
            autoFocus
          >
            {lang('确定', 'OK')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
