import { Box, Pagination } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { changeStore, useSelector } from 'src/store/state';
// import LinkerDisplay from '../LinkerDisplay';
import {
  selectIsPad,
  selectLinkerList,
  selectPageParams,
} from 'src/store/state/defaultStore';
import { throttle } from 'lodash';
import BlockMenu, { MENU_ID as MENU_ID1 } from './BlockMenu';
import { useContextMenu } from 'react-contexify';
import LinkerDisplay from '../../LinkerDisplay';

const SIZE_PARAMS = {
  NORMAL: {
    height: 436,
    width: 960,
    col: 9,
  },
  PAD: { height: 326, width: 654, col: 7 },
};

const LinkerList: React.FC<{}> = () => {
  const [selectedLinkerId, setSelectedLinkerId] = useState('');
  const linkers = useSelector(selectLinkerList);
  const { pageIndex, maxPageIndex } = useSelector(selectPageParams);
  const isPad = useSelector(selectIsPad);
  const SIZE_PARAM = isPad ? SIZE_PARAMS.PAD : SIZE_PARAMS.NORMAL;
  const { show: show } = useContextMenu({
    id: MENU_ID1,
  });
  const handleMenuOpen = useCallback((e: any) => {
    show({
      event: e,
    });
  }, []);
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
        setSelectedLinkerId(l.id);
        handleMenuOpen(e);
      }}
    >
      <LinkerDisplay linker={l} key={l.id} fullwidth />
    </Box>
  ));

  const handleWheel = useMemo(() => {
    const hd = (e: React.WheelEvent<HTMLDivElement>) => {
      const isUp = e.deltaY < 0;
      changeStore((d) => {
        d.query.pageIndex += isUp ? -1 : 1;
      });
    };
    return throttle(hd, 500);
  }, [changeStore]);

  return (
    <>
      <Box sx={{ minHeight: SIZE_PARAM.height }} onWheel={handleWheel}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${SIZE_PARAM.col}, 1fr)`,
            gap: 0.5,
            minWidth: SIZE_PARAM.width,
          }}
        >
          {linkerBlocks}
        </Box>
      </Box>
      <Pagination
        count={maxPageIndex + 1}
        page={pageIndex + 1}
        showFirstButton
        showLastButton
        siblingCount={4}
        boundaryCount={2}
        onChange={(_, page) => {
          changeStore((d) => {
            d.query.pageIndex = page - 1;
          });
        }}
      />
      <BlockMenu linkerId={selectedLinkerId} />
    </>
  );
};

export default LinkerList;
