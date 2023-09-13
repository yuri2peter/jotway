import React, { useCallback } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useImmer } from 'src/hooks/useImmer';
import { glassStyle } from 'src/styles/utils';
import { lang } from 'src/components/app/utils';

const refHack = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  current: (title: string, content: string) => {
    return new Promise<void>((_, reject) => {
      reject();
    });
  },
};

interface DialogProps {
  open: boolean;
  title: string;
  content: string;
  onAgreen: () => void;
  onCancle: () => void;
}

export const DialogConfirmHack: React.FC<{}> = () => {
  const [dialogProps, changeDialogProps] = useImmer({
    open: false,
    title: '',
    content: '',
    onAgreen: () => {},
    onCancle: () => {},
  });
  const handleClose = useCallback(() => {
    changeDialogProps((d) => {
      d.open = false;
    });
  }, [changeDialogProps]);
  const newConfirm = useCallback(
    (title: string, content: string) => {
      return new Promise<void>((resolve, reject) => {
        changeDialogProps((d) => {
          Object.assign(d, {
            open: true,
            title,
            content,
            onAgreen: () => {
              handleClose();
              resolve();
            },
            onCancle: () => {
              handleClose();
              reject();
            },
          });
        });
      });
    },
    [changeDialogProps, handleClose]
  );
  refHack.current = newConfirm;
  return <AlertDialog {...dialogProps} />;
};

export function dialogConfirm(
  title = lang(`确认操作`, 'Confirm'),
  content = lang('该操作将不可撤销。', 'This operation will be irreversible.')
) {
  return refHack.current(title, content);
}

const AlertDialog: React.FC<DialogProps> = ({
  open,
  title,
  content,
  onAgreen,
  onCancle,
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
            <IconButton onClick={onCancle}>
              <CloseOutlined />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancle}>{lang('取消', 'Cancel')}</Button>
          <Button variant="contained" onClick={onAgreen} autoFocus>
            {lang('确定', 'OK')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
