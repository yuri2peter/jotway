import { Button, MenuItem, Select, SxProps } from '@mui/material';
import { useInViewport } from 'react-in-viewport';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { changeStore, useSelector } from 'src/store/state';
import {
  selectHasUnClassified,
  selectQuery,
  selectTags,
} from 'src/store/state/defaultStore';
import RowStack from 'src/components/RowStack';
import { useContextMenu } from 'react-contexify';
import { MENU_ID } from './pc/TagMenu';
import { TagSelectOptions } from 'src/store/state/types';
import { lang } from 'src/components/app/utils';

const TagSelectorLite: React.FC = () => {
  const ref = useRef(null);
  const { inViewport } = useInViewport(ref);
  const { tag } = useSelector(selectQuery);
  const baseTags = useSelector(selectTags);
  const { show } = useContextMenu({
    id: MENU_ID,
  });
  useEffect(() => {
    const notTop = ref.current && !inViewport;
    changeStore((d) => {
      d.appearance.mobileAtTop = !notTop;
    });
  }, [inViewport]);
  return (
    <RowStack
      spacing={2}
      flexWrap={'wrap'}
      maxWidth={1000}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        '&>*': {
          marginY: 1,
        },
      }}
    >
      {/* 大类 */}
      <TagClass />
      {/* 常规标签 */}
      {baseTags.map((t) => {
        const active = tag === t;
        return (
          <Button
            key={t}
            variant={active ? 'outlined' : 'text'}
            sx={commonSx()}
            onContextMenu={(e) => {
              changeStore((d) => {
                d.appearance.tagMenuTagName = t;
              });
              e.stopPropagation();
              show({
                event: e,
              });
            }}
            onClick={() => {
              changeStore((d) => {
                d.query.tagClass = 'tagSelected';
                d.query.keyword = '';
                d.query.tag = t;
              });
            }}
          >
            {t}
          </Button>
        );
      })}
    </RowStack>
  );
};

export default TagSelectorLite;

function commonSx(): SxProps {
  return {
    minWidth: 0,
    textTransform: 'none',
    '&.MuiButton-text': {
      padding: '4px 10px',
    },
    '&.MuiButton-outlined': {
      color: 'white',
    },
  };
}

const TagClass: React.FC = () => {
  const { keyword, tagClass } = useSelector(selectQuery);
  const hasUnClassified = useSelector(selectHasUnClassified);
  return (
    <>
      <Button
        variant={tagClass === 'all' ? 'outlined' : 'text'}
        sx={commonSx()}
        onClick={() => {
          changeStore((d) => {
            d.query.tagClass = 'all';
            d.query.keyword = '';
            d.query.tag = '';
          });
        }}
      >
        {lang(...TagSelectOptions.all)}
      </Button>
      <Button
        variant={tagClass === 'recently' ? 'outlined' : 'text'}
        sx={commonSx()}
        onClick={() => {
          changeStore((d) => {
            d.query.tagClass = 'recently';
            d.query.keyword = '';
            d.query.tag = '';
          });
        }}
      >
        {lang(...TagSelectOptions.recently)}
      </Button>
      {hasUnClassified && (
        <Button
          variant={tagClass === 'unclassified' ? 'outlined' : 'text'}
          sx={commonSx()}
          onClick={() => {
            changeStore((d) => {
              d.query.tagClass = 'unclassified';
              d.query.keyword = '';
              d.query.tag = '';
            });
          }}
        >
          {lang(...TagSelectOptions.unclassified)}
        </Button>
      )}
      {keyword && (
        <Button variant={'outlined'} sx={commonSx()}>
          {keyword}
        </Button>
      )}
    </>
  );
};
