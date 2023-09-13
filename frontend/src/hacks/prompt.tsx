import React, { useCallback, useEffect, useState } from 'react';

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
  Stack,
  TextField,
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useImmer } from 'src/hooks/useImmer';
import { glassStyle } from 'src/styles/utils';
import { lang } from 'src/components/app/utils';

interface Params {
  title?: string;
  content?: string;
  defaultInputValue?: string;
}

const refHack = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  current: (params: Params) => {
    return new Promise<string>((_, reject) => {
      reject();
    });
  },
};

interface DialogProps {
  open: boolean;
  title: string;
  content: string;
  defaultInputValue: string;
  onAgreen: (value: string) => void;
  onCancle: () => void;
}

export const PromptHack: React.FC<{}> = () => {
  const [dialogProps, changeDialogProps] = useImmer<DialogProps>({
    open: false,
    title: '',
    content: '',
    defaultInputValue: '',
    onAgreen: () => {},
    onCancle: () => {},
  });
  const handleClose = useCallback(() => {
    changeDialogProps((d) => {
      d.open = false;
    });
  }, [changeDialogProps]);
  const newPrompt = useCallback(
    ({
      title = '输入',
      content = '请输入参数',
      defaultInputValue = '',
    }: Params) => {
      return new Promise<string>((resolve, reject) => {
        changeDialogProps((d) => {
          Object.assign(d, {
            open: true,
            title,
            content,
            defaultInputValue,
            onAgreen: (value: string) => {
              handleClose();
              resolve(value);
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
  refHack.current = newPrompt;
  return <PromptDialog {...dialogProps} />;
};

export function dialogPrompt(params: Params = {}) {
  return refHack.current(params);
}

const PromptDialog: React.FC<DialogProps> = ({
  open,
  title,
  content,
  defaultInputValue,
  onAgreen,
  onCancle,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(defaultInputValue);
  useEffect(() => {
    setInputValue(defaultInputValue);
  }, [defaultInputValue]);
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
          <Stack spacing={2}>
            <DialogContentText>{content}</DialogContentText>
            <TextField
              onFocus={(e) => {
                e.target.select();
              }}
              fullWidth
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancle}>{lang('取消', 'Cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => {
              onAgreen(inputValue);
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
