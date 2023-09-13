import React, { ReactNode, useContext, useCallback } from 'react';

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
import { useImmer } from './useImmer';
import { CloseOutlined } from '@ant-design/icons';

// ==============================|| DIALOG - ALERT ||============================== //

interface DialogProps {
  open: boolean;
  title: string;
  content: string;
  onAgreen: () => void;
  onCancle: () => void;
}

type OpenConfirm = (params?: {
  title: string;
  content: string;
}) => Promise<void>;
const Context = React.createContext<OpenConfirm>(() => {
  return new Promise((resolve) => resolve());
});

export const ConfirmWrapper = ({ children }: { children: ReactNode }) => {
  const [state, changeState] = useImmer({
    open: false,
    title: '',
    content: '',
    handleAgreen: () => {},
    handleCancle: () => {},
  });
  const openConfirm: OpenConfirm = useCallback(
    (
      params = {
        title: '确认操作?',
        content: '该操作将不可撤销。',
      }
    ) => {
      return new Promise((resolve, reject) => {
        changeState((draft) => {
          draft.open = true;
          draft.title = params.title;
          draft.content = params.content;
          draft.handleAgreen = () => {
            resolve();
          };
          draft.handleCancle = reject;
        });
      });
    },
    [changeState]
  );
  const handleOk = useCallback(() => {
    changeState((draft) => {
      draft.open = false;
    });
    state.handleAgreen();
  }, [changeState, state]);
  const handleClose = useCallback(() => {
    changeState((draft) => {
      draft.open = false;
    });
    state.handleCancle();
  }, [changeState, state]);

  return (
    <Context.Provider value={openConfirm}>
      <AlertDialog {...state} onAgreen={handleOk} onCancle={handleClose} />
      {children}
    </Context.Provider>
  );
};

export const useConfirm = () => {
  const openConfirm = useContext(Context);
  return openConfirm;
};

const AlertDialog: React.FC<DialogProps> = ({
  open,
  title,
  content,
  onAgreen,
  onCancle,
}) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onCancle} fullWidth maxWidth="xs">
      <Box sx={{ p: 1, py: 1.5 }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Grid item>
            <DialogTitle sx={{ fontSize: 14 }}>{title}</DialogTitle>
          </Grid>
          <Grid item sx={{ mr: 1.5 }}>
            <IconButton color="secondary" onClick={onCancle}>
              <CloseOutlined />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={onCancle}>
            取消
          </Button>
          <Button variant="contained" onClick={onAgreen} autoFocus>
            确定
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
