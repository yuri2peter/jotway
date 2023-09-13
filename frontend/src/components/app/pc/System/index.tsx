import equal from 'fast-deep-equal';
import React from 'react';
import { changeStore, useStore } from 'src/store/state';
import Content from './Content';
import Modal from 'src/components/Modal';
import { saveSettingsFromForm } from 'src/store/state/actions/settings';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { settingsSchema } from '@local/common';
import { lang } from 'src/components/app/utils';

const SystemModal: React.FC = () => {
  const {
    systemForm: { modalOpen, settings: formSettings },
    settings: currentSettings,
  } = useStore();
  const handleClose = async () => {
    const settingsChanged = !equal(formSettings, currentSettings);
    if (settingsChanged) {
      const { success } = settingsSchema.safeParse(formSettings);
      if (!success) {
        snackbarMessage(
          lang('系统设置不合法', 'Invalid system settings.'),
          'error'
        );
        return;
      }
      try {
        await saveSettingsFromForm(formSettings);
        snackbarMessage(
          lang('系统设置已保存', 'System settings saved.'),
          'success'
        );
      } catch (error) {
        console.warn(error);
        snackbarMessage(
          lang('保存系统设置失败', 'Failed to save system settings.'),
          'error'
        );
      }
    }
    changeStore((d) => {
      d.systemForm.modalOpen = false;
    });
  };
  return (
    <Modal
      title={lang('系统', 'System')}
      onClose={handleClose}
      maxWidth="md"
      open={modalOpen}
    >
      <Content onClose={handleClose} />
    </Modal>
  );
};

export default SystemModal;
