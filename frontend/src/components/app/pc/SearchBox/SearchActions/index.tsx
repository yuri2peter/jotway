import { Box, List } from '@mui/material';
import React from 'react';
import { useStore } from 'src/store/state';
import { Action, useMyContext } from './defines';
import AddUrlLinker from './AddUrlLinker';
import InsiderSearchMore from './InsiderSearchMore';
import WwwSearch from './WwwSearch';
import AddArticlelLinker from './AddArticlelLinker';
import { glassStyle } from 'src/styles/utils';
import InsiderSearchOne from './InsiderSearchOne';

const SearchActions: React.FC = () => {
  const {
    search: { text, focus },
  } = useStore();
  const { actions, selectedIndex } = useMyContext();
  if (!focus || !text) {
    return null;
  }
  return (
    <Box
      sx={{
        ...glassStyle(),
        minHeight: 100,
        maxHeight: 400,
        overflow: 'auto',
        borderRadius: '0 0 12px 12px',
        borderTop: 'none',
        position: 'absolute',
        top: '100%',
        width: '100%',
        zIndex: 4,
      }}
    >
      <List
        sx={{
          '& .MuiSvgIcon-root ': {
            marginRight: 0.5,
          },
        }}
      >
        {actions.map((t, i) => (
          <ActionWarpper
            key={t.type === 'ActionInsiderSearchOne' ? i : t.type}
            action={t}
            selected={selectedIndex === i}
          />
        ))}
      </List>
    </Box>
  );
};

const ActionWarpper: React.FC<{ action: Action; selected: boolean }> = ({
  action,
  selected,
}) => {
  const { type } = action;
  if (type === 'ActionAddUrlLinker') {
    return <AddUrlLinker {...action} selected={selected} />;
  }
  if (type === 'ActionWwwSearch') {
    return <WwwSearch {...action} selected={selected} />;
  }
  if (type === 'ActionInsiderSearchMore') {
    return <InsiderSearchMore {...action} selected={selected} />;
  }
  if (type === 'ActionInsiderSearchOne') {
    return <InsiderSearchOne {...action} selected={selected} />;
  }
  if (type === 'AddArticlelLinker') {
    return <AddArticlelLinker {...action} selected={selected} />;
  }
  return null;
};

export default SearchActions;
