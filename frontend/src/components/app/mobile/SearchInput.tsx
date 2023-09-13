import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { changeStore, useStore } from 'src/store/state';
import RowStack from 'src/components/RowStack';

const SearchInput: React.FC<{}> = () => {
  const {
    search: { inputValue },
  } = useStore();
  const onSearchTextChange = useCallback(
    (v: string) => {
      changeStore((d) => {
        d.query.keyword = v;
        d.query.tag = '';
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
      d.search.inputValue = v;
    });
    onSearchTextChangeDebounced(v);
  }, []);
  return (
    <RowStack
      sx={{
        flexGrow: 1,
        borderRadius: 3,
      }}
    >
      <TextField
        placeholder="Jotway"
        value={inputValue}
        spellCheck={false}
        autoFocus
        sx={{ flexGrow: 1 }}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <SearchIcon color="primary" sx={{ marginRight: 0.5 }} />
          ),
        }}
      />
    </RowStack>
  );
};

export default SearchInput;
