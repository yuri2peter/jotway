import React, { useCallback, useRef } from 'react';
import { Box } from '@mui/material';
import { useContextMenu } from 'react-contexify';
import { changeStore, useSelector } from 'src/store/state';
import { selectLinkerFilterd } from 'src/store/state/defaultStore';
import { LINKER_BLOCK_MENU_ID } from '../defines';
import LinkerDisplay from '../../miscs/LinkerDisplay';
import { Linker } from '@local/common';

const LinkerList: React.FC<{}> = () => {
  const linkers = useSelector(selectLinkerFilterd);
  const { show } = useContextMenu({
    id: LINKER_BLOCK_MENU_ID,
  });
  const refShow = useRef(show);
  refShow.current = show;
  const handleMenuOpen = useCallback((e: any) => {
    refShow.current({
      event: e,
    });
  }, []);
  return (
    <Box
      sx={{
        display: 'flex',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        overflow: 'auto',
      }}
    >
      <MemoBlocks linkers={linkers} onMenuOpen={handleMenuOpen} />
    </Box>
  );
};

const Blocks: React.FC<{
  linkers: Linker[];
  onMenuOpen: (e: any) => void;
}> = ({ linkers, onMenuOpen }) => {
  console.log(1);
  const linkerBlocks = linkers.map((l) => (
    <Box
      key={l.id}
      sx={{
        width: 90,
        '&:hover': {
          borderRadius: 2,
          background: '#00000070',
        },
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        changeStore((d) => {
          d.appearance.blockMenuBlockId = l.id;
        });
        onMenuOpen(e);
      }}
    >
      <LinkerDisplay linker={l} key={l.id} />
    </Box>
  ));
  return <>{linkerBlocks}</>;
};

const MemoBlocks = React.memo(Blocks);

export default LinkerList;
