import React from 'react';
import RowStack from 'src/components/miscs/RowStack';
import TagSelectorLite from './TagSelectorLite';
import LinkerList from './LinkList';

const BodyPart: React.FC<{}> = () => {
  return (
    <RowStack
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '1px',
        alignItems: 'stretch',
      }}
    >
      <TagSelectorLite />
      <LinkerList />
    </RowStack>
  );
};

export default BodyPart;
