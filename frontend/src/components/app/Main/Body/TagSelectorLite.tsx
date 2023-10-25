import { List, ListItemButton } from '@mui/material';
import { useInViewport } from 'react-in-viewport';
import React, { useEffect, useRef } from 'react';
import { changeStore, useSelector } from 'src/store/state';
import {
  selectUnClassifiedLinkersCount,
  selectTagMenuWidth,
  selectQuery,
  selectTagCounts,
  selectRecentlyLinkersCount,
  selectAllLinkersCount,
  selectSearchLinkersCount,
} from 'src/store/state/defaultStore';
import { useContextMenu } from 'react-contexify';
import { TagSelectOptions } from 'src/store/state/types';
import { lang } from 'src/components/app/utils';
import { TAG_MENU_ID } from '../defines';

const TagSelectorLite: React.FC = () => {
  const ref = useRef(null);
  const { inViewport } = useInViewport(ref);
  const { tag } = useSelector(selectQuery);
  const tagMenuWidth = useSelector(selectTagMenuWidth);
  const baseTags = useSelector(selectTagCounts);
  const { show } = useContextMenu({
    id: TAG_MENU_ID,
  });
  useEffect(() => {
    const notTop = ref.current && !inViewport;
    changeStore((d) => {
      d.appearance.mobileAtTop = !notTop;
    });
  }, [inViewport]);
  return (
    <List
      dense
      sx={{
        paddingRight: 0,
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'auto',
        flexShrink: 0,
        width: tagMenuWidth,
        '&>div': {
          wordBreak: 'break-word',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '1',
          WebkitBoxOrient: 'vertical',
          fontSize: '14px',
        },
      }}
    >
      {/* 大类 */}
      <TagClass />
      {/* 常规标签 */}
      {baseTags.map(({ name, numCount }) => {
        const active = tag === name;
        return (
          <ListItemButton
            key={name}
            selected={active}
            onContextMenu={(e) => {
              changeStore((d) => {
                d.appearance.tagMenuTagName = name;
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
                d.query.tag = name;
              });
            }}
          >
            <TagDisplay tagName={name} count={numCount} />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default TagSelectorLite;

const TagClass: React.FC = () => {
  const { keyword, tagClass } = useSelector(selectQuery);
  const allLinkersCount = useSelector(selectAllLinkersCount);
  const unClassifiedLinkersCount = useSelector(selectUnClassifiedLinkersCount);
  const recentlyLinkersCount = useSelector(selectRecentlyLinkersCount);
  const searchLinkersCount = useSelector(selectSearchLinkersCount);
  return (
    <>
      <ListItemButton
        selected={tagClass === 'all'}
        onClick={() => {
          changeStore((d) => {
            d.query.tagClass = 'all';
            d.query.keyword = '';
            d.query.tag = '';
          });
        }}
      >
        <TagDisplay
          tagName={lang(...TagSelectOptions.all)}
          count={allLinkersCount}
        />
      </ListItemButton>
      {recentlyLinkersCount ? (
        <ListItemButton
          selected={tagClass === 'recently'}
          onClick={() => {
            changeStore((d) => {
              d.query.tagClass = 'recently';
              d.query.keyword = '';
              d.query.tag = '';
            });
          }}
        >
          <TagDisplay
            tagName={lang(...TagSelectOptions.recently)}
            count={recentlyLinkersCount}
          />
        </ListItemButton>
      ) : null}
      {unClassifiedLinkersCount ? (
        <ListItemButton
          selected={tagClass === 'unclassified'}
          onClick={() => {
            changeStore((d) => {
              d.query.tagClass = 'unclassified';
              d.query.keyword = '';
              d.query.tag = '';
            });
          }}
        >
          <TagDisplay
            tagName={lang(...TagSelectOptions.unclassified)}
            count={unClassifiedLinkersCount}
          />
        </ListItemButton>
      ) : null}
      {searchLinkersCount ? (
        <ListItemButton selected>
          <TagDisplay tagName={keyword} count={searchLinkersCount} />
          {}
        </ListItemButton>
      ) : null}
    </>
  );
};

const TagDisplay: React.FC<{ tagName: string; count: number }> = ({
  tagName,
  count,
}) => {
  return <>{`${tagName} (${count})`}</>;
};
