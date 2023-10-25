import { uniq } from 'lodash';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'src/store/state';
import { selectTags } from 'src/store/state/defaultStore';
import RowStack from 'src/components/miscs/RowStack';
import { lang } from 'src/components/app/utils';

const TagSelector: React.FC<{
  value: string[];
  onChange: (tags: string[]) => void;
}> = ({ onChange, value }) => {
  const baseTags = useSelector(selectTags);
  const [text, setText] = useState('');
  const tags = useMemo(() => {
    return uniq([...baseTags, ...value]);
  }, [value, baseTags]);
  const handleCreate = useCallback(() => {
    if (!text || value.includes(text)) {
      return;
    }
    onChange([...value, text]);
    setText('');
  }, [onChange, text, value]);
  return (
    <RowStack spacing={0} flexWrap={'wrap'}>
      <TextField
        value={text}
        placeholder={lang('添加标签', 'New Tag')}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCreate();
          }
        }}
        sx={{
          marginRight: 1,
          marginBottom: 1,
        }}
        InputProps={{
          sx: { width: 140, fontSize: '12px' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={!text}
                onClick={handleCreate}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {tags.map((t) => {
        const active = value.includes(t);
        const keywordMatch =
          text && t.toLowerCase().includes(text.toLowerCase());
        return (
          <Button
            key={t}
            variant={active ? 'contained' : keywordMatch ? 'outlined' : 'text'}
            sx={{
              textTransform: 'none',
              marginRight: 1,
              marginBottom: 1,
              minWidth: 0,
            }}
            onClick={() => {
              if (active) {
                onChange(value.filter((v) => v !== t));
              } else {
                onChange([...value, t]);
              }
            }}
          >
            {t}
          </Button>
        );
      })}
    </RowStack>
  );
};

export default TagSelector;
