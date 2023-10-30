import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { changeStore, useSelector } from 'src/store/state';
import { CloseOutlined } from '@ant-design/icons';
import PlusOneOutlinedIcon from '@mui/icons-material/PlusOneOutlined';
import { debounce } from 'lodash';
import { selectIsKeywordMode, selectQuery } from 'src/store/state/defaultStore';
import { getGlobalData } from 'src/store/globalData';
import { IconButton, Tooltip } from '@mui/material';
import { lang } from '../../utils';
import { openLinkerForm } from 'src/store/state/actions/linker';
import { getNewLinker } from '@local/common';
import dayjs from 'dayjs';

const Search: React.FC<{}> = () => {
  const { tag } = useSelector(selectQuery);
  const [inputValue, setInputValue] = useState('');
  const refInput = React.useRef<HTMLInputElement>(null);
  const isKeywordMode = useSelector(selectIsKeywordMode);
  const isLink = inputValue.startsWith('http');
  useEffect(() => {
    if (!isKeywordMode) {
      setInputValue('');
    }
  }, [isKeywordMode]);
  const onSearchTextChange = useCallback((v: string) => {
    if (v) {
      changeStore((d) => {
        d.query.keyword = v;
        // d.query.tag = '';
        d.query.tagClass = 'keyword';
      });
    } else {
      changeStore((d) => {
        d.query.keyword = '';
        d.query.tag = '';
        d.query.tagClass = 'all';
      });
    }
  }, []);
  const onSearchTextChangeDebounced = useMemo(() => {
    return debounce(onSearchTextChange, 500);
  }, [onSearchTextChange]);
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputValue(v);
      onSearchTextChangeDebounced(v);
    },
    [onSearchTextChangeDebounced]
  );
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
    <>
      <TextField
        fullWidth
        placeholder="CTRL + K"
        inputRef={refInput}
        autoFocus
        value={inputValue}
        onChange={handleInputChange}
        size="small"
        InputProps={{
          startAdornment: (
            <SearchIcon color="primary" sx={{ marginRight: 0.5 }} />
          ),
          endAdornment: inputValue ? (
            <IconButton
              color="primary"
              onClick={() => {
                setInputValue('');
                changeStore((d) => {
                  d.query.keyword = '';
                  d.query.tag = '';
                  d.query.tagClass = 'all';
                });
                getGlobalData().focusSearchInput();
              }}
            >
              <CloseOutlined />
            </IconButton>
          ) : null,
        }}
      />
      {inputValue && isLink && (
        <Tooltip title={lang('添加书签', 'New Bookmark')}>
          <IconButton
            onClick={() => {
              openLinkerForm(
                {
                  ...getNewLinker(),
                  name: inputValue,
                  url: inputValue,
                  tags: tag ? [tag] : [],
                },
                true
              );
            }}
          >
            <PlusOneOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {inputValue && !isLink && (
        <Tooltip title={lang('添加笔记', 'New Note')}>
          <IconButton
            onClick={() => {
              openLinkerForm(
                {
                  ...getNewLinker(),
                  name: inputValue,
                  article: true,
                  tags: tag ? [tag] : [],
                  content: `# ${inputValue}\n\n> ${dayjs().format(
                    'YYYY-MM-DD'
                  )}\n\n`,
                },
                true
              );
            }}
          >
            <PlusOneOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default Search;
