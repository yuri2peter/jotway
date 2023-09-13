import UploadIcon from '@mui/icons-material/Upload';
import { ButtonBase } from '@mui/material';
import React from 'react';
import { uploadFileToServer } from 'src/api/utils';
import CentralBox from 'src/components/CentralBox';
import { UploadResults } from 'src/components/NowUploader';
import { uploadFileFromLocal } from 'src/utils/file';

interface Props {
  disabled?: boolean;
  onUploaded?: (url: string) => void;
  width?: number;
  height?: number;
}

const WallpaperUploader: React.FC<Props> = ({
  disabled = false,
  onUploaded = () => {},
  width = 150,
  height = 80,
}) => {
  return (
    <ButtonBase
      disabled={disabled}
      onClick={() => {
        upload().then(({ newFilename }) => {
          const url = `/uploads/${newFilename}`;
          onUploaded(url);
        });
      }}
    >
      <CentralBox
        sx={{
          border: '2px solid gray',
          margin: 0.5,
          width,
          height,
          flexShrink: 0,
        }}
      >
        <UploadIcon />
      </CentralBox>
    </ButtonBase>
  );
};

export default WallpaperUploader;

async function upload(): Promise<UploadResults> {
  const file = await uploadFileFromLocal();
  const form = new FormData();
  form.append('file', file);
  return uploadFileToServer(file);
}
