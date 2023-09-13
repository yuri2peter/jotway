import { InputBase, IconButton, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import React, { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { changeStore, useStore } from 'src/store/state';
import { useMyContext } from './SearchActions/defines';
import RowStack from 'src/components/RowStack';
import { glassStyle } from 'src/styles/utils';
import { CloseOutlined } from '@ant-design/icons';
import { getGlobalData } from 'src/store/globalData';
import { lang } from '../../utils';

const SearchInput: React.FC<{}> = () => {
  const {
    search: { focus, text, inputValue },
  } = useStore();
  const refInput = React.useRef<HTMLInputElement>(null);
  const { refHandleSubmit } = useMyContext();
  const onSearchTextChange = useCallback(
    (v: string) => {
      changeStore((d) => {
        d.search.text = v;
      });
    },
    [changeStore]
  );
  const onSearchTextChangeDebounced = useMemo(() => {
    return debounce(onSearchTextChange, 500);
  }, [onSearchTextChange]);
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    changeStore((d) => {
      d.search.focus = !!v;
      d.search.inputValue = v;
    });
    onSearchTextChangeDebounced(v);
  }, []);
  useEffect(() => {
    const gd = getGlobalData();
    gd.focusSearchInput = () => {
      refInput.current?.focus();
    };
    return () => {
      gd.focusSearchInput = () => {};
    };
  }, []);
  return (
    <RowStack
      sx={{
        padding: 1,
        ...glassStyle(),
        borderRadius: focus && text ? '12px 12px 0 0' : 3,
      }}
    >
      <IconButton sx={{ p: 1 }} disabled>
        <SearchIcon color="primary" />
      </IconButton>
      <InputBase
        inputRef={refInput}
        placeholder={`[CTRL + K]    ${lang(
          '搜索 / 书签 / 笔记',
          'Search / Bookmark / Note'
        )}`}
        value={inputValue}
        spellCheck={false}
        // autoFocus
        sx={{ flexGrow: 1, whiteSpace: 'pre' }}
        onChange={handleInputChange}
        onFocus={() => {
          changeStore((d) => {
            d.search.focus = true;
          });
        }}
        endAdornment={
          inputValue ? (
            <IconButton
              color="primary"
              onClick={() => {
                changeStore((d) => {
                  d.search.focus = false;
                  d.search.inputValue = '';
                  d.search.text = '';
                });
                getGlobalData().focusSearchInput();
              }}
            >
              <CloseOutlined />
            </IconButton>
          ) : null
        }
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton sx={{ p: 1 }} onClick={refHandleSubmit.current}>
        <SendIcon />
      </IconButton>
    </RowStack>
  );
};

export default SearchInput;
