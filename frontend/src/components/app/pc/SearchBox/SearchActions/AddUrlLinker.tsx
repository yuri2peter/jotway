import { ListItem, ListItemButton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import HourglassEmptySharpIcon from '@mui/icons-material/HourglassEmptySharp';
import { parseUrl } from 'src/api/utils';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { openLinkerForm } from 'src/store/state/actions/linker';
import { useMyContext } from './defines';
import { resetSearch } from 'src/store/state/actions/search';
import { getStore, useSelector } from 'src/store/state';
import { selectQuery } from 'src/store/state/defaultStore';
import ImageIcon from '../../../ImageIcon';
import { lang } from 'src/components/app/utils';
import { getNewLinker } from '@local/common';

const AddUrlLinker: React.FC<{ url: string; selected: boolean }> = ({
  url,
  selected,
}) => {
  const settings = getStore().settings;
  const { tag } = useSelector(selectQuery);
  const { refHandleSubmit } = useMyContext();
  const [parsing, setParsing] = useState(false);
  const [parseUrlResult, setParseUrlResult] = useState<{
    title: string;
    description: string;
    iconLink: string;
  } | null>(null);
  const cb = useCallback(() => {
    resetSearch();
    openLinkerForm(
      {
        ...getNewLinker(),
        desc: parseUrlResult?.description || url,
        name: parseUrlResult?.title || url,
        url: url,
        icon: parseUrlResult?.iconLink || '',
        tags: tag ? [tag] : [],
      },
      true
    );
  }, [parseUrlResult, url]);
  useEffect(() => {
    (async () => {
      setParsing(true);
      try {
        const r = await parseUrl(
          url,
          settings.htmlParseServer,
          settings.htmlParseTimeoutSeconds * 1000
        );
        setParseUrlResult(r);
      } catch (error) {}
      setParsing(false);
    })();
  }, [url]);
  useEffect(() => {
    if (selected) {
      refHandleSubmit.current = cb;
    }
  }, [selected, cb]);
  console.log(parseUrlResult);
  return (
    <ListItem dense>
      <ListItemButton onClick={cb} selected={selected}>
        <StarBorderIcon color={'primary'} />
        <Typography sx={{ whiteSpace: 'nowrap' }} color={'primary'}>
          {lang('添加书签', 'New Bookmark')}
        </Typography>
        {parseUrlResult ? (
          <Typography
            marginLeft={2}
            noWrap
            flexGrow={1}
            color={'text.secondary'}
          >
            <ImageIcon
              src={parseUrlResult.iconLink}
              baseUrl={url}
              sx={{ marginRight: 0.5 }}
            />
            {parseUrlResult.title || url}
            {parseUrlResult.description
              ? ` (${parseUrlResult.description})`
              : ''}
          </Typography>
        ) : (
          <Typography
            marginLeft={2}
            noWrap
            flexGrow={1}
            color={'text.secondary'}
          >
            {parsing && <HourglassEmptySharpIcon />}
            {url}
          </Typography>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default AddUrlLinker;
