// 模态框，内部管理状态
import { Breakpoint } from '@mui/material';
import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import Modal from './Modal';

type CtrlRenderer = (props: {
  handleOpen: () => void; // 主动打开
  handleClose: () => void; // 主动关闭
  open: boolean;
}) => React.ReactElement;

type ContentRenderer = (props: {
  handleClose: () => void;
  refClosedCallback: React.MutableRefObject<() => void>;
}) => React.ReactElement;

const ModalProvider: React.FC<{
  ctrlRenderer: CtrlRenderer;
  contentRenderer: ContentRenderer;
  title: string;
  maxWidth?: Breakpoint;
}> = ({ ctrlRenderer, contentRenderer, title, maxWidth = 'sm' }) => {
  const [open, setOpen] = useState(false);
  const refClosedCallback = useRef(() => {});
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    refClosedCallback.current();
    setOpen(false);
  }, []);
  const ctrlProps = React.useMemo(() => {
    return {
      handleClose,
      handleOpen,
      open,
    };
  }, [handleClose, handleOpen, open]);
  const contentProps = React.useMemo(() => {
    return {
      handleClose,
      refClosedCallback,
    };
  }, [handleClose]);

  return (
    <>
      {ctrlRenderer(ctrlProps)}
      <Modal
        open={open}
        title={title}
        maxWidth={maxWidth}
        onClose={handleClose}
      >
        {contentRenderer(contentProps)}
      </Modal>
    </>
  );
};

export default ModalProvider;
