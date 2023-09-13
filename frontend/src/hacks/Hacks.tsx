import React from 'react';
import { DialogConfirmHack } from './comfirm';
import { PromptHack } from './prompt';
import { NavigationHack } from './navigate';
import { SnackbarHack } from './snackbarMessage';
import { WorkerHack } from './worker';
import { RestrictedMessageHack } from './restrictedMessage';

const Hacks: React.FC = () => {
  return (
    <>
      <SnackbarHack />
      <NavigationHack />
      <DialogConfirmHack />
      <PromptHack />
      <WorkerHack />
      <RestrictedMessageHack />
    </>
  );
};

export default Hacks;
