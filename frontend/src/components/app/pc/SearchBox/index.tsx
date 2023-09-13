import React, { useMemo, useRef, useState } from 'react';
import SearchInput from './SearchInput';
import SearchActions from './SearchActions';
import { Box } from '@mui/material';
import { useSelector, useStore } from 'src/store/state';
import { Action, MyContext } from './SearchActions/defines';
import { clamp } from 'lodash';
import { selectInsiderLinkers } from 'src/store/state/defaultStore';

const insiderLinkerPreviewCount = 3; // 需要在搜索栏预览的linker的数目

const SearchBox: React.FC<{}> = () => {
  const {
    search: { text, inputValue },
  } = useStore();
  const insiderLinkers = useSelector(selectInsiderLinkers);
  const refHandleSubmit = useRef(() => {});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const actions = useMemo(() => {
    const ac: Action[] = [];
    const isLink = text.startsWith('http');

    if (isLink) {
      ac.push({
        type: 'ActionAddUrlLinker',
        url: text,
      });
    }
    insiderLinkers.slice(0, insiderLinkerPreviewCount).forEach((l) => {
      ac.push({
        type: 'ActionInsiderSearchOne',
        linker: l,
        text,
        _text: l._text,
        multi: true,
      });
    });
    if (insiderLinkers.length > 0) {
      ac.push({
        type: 'ActionInsiderSearchMore',
        text: text,
        count: insiderLinkers.length,
      });
    }
    ac.push({
      type: 'ActionWwwSearch',
      text: inputValue,
    });
    if (!isLink) {
      ac.push({
        type: 'AddArticlelLinker',
        text: text,
      });
    }
    return ac;
  }, [text, inputValue, insiderLinkers]);
  const selectedIndexFixed = clamp(selectedIndex, 0, actions.length - 1);
  return (
    <MyContext.Provider
      value={{
        actions,
        refHandleSubmit,
        selectedIndex: selectedIndexFixed,
        setSelectedIndex,
      }}
    >
      <Box
        sx={{
          width: 600,
          position: 'relative',
          zIndex: 4,
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'Enter':
              refHandleSubmit.current();
              break;
            case 'ArrowUp':
              if (selectedIndex > 0) {
                setSelectedIndex(selectedIndexFixed - 1);
              } else {
                setSelectedIndex(actions.length - 1);
              }
              break;
            case 'ArrowDown':
              if (selectedIndex < actions.length - 1) {
                setSelectedIndex(selectedIndexFixed + 1);
              } else {
                setSelectedIndex(0);
              }
              break;
            default:
              break;
          }
        }}
      >
        <SearchInput />
        <SearchActions />
      </Box>
    </MyContext.Provider>
  );
};

export default SearchBox;
