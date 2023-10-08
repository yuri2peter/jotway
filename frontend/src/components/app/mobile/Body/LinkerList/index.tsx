import { Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'src/store/state';
import { selectLinkerFilterd } from 'src/store/state/defaultStore';
import LinkerDisplay from '../../../LinkerDisplay';

const LinkerList: React.FC<{}> = () => {
  const linkers = useSelector(selectLinkerFilterd);

  return (
    <Grid container spacing={0.5} p={1.5}>
      {linkers.map((t) => (
        <Grid item xs={3} key={t.id}>
          <LinkerDisplay linker={t} key={t.id} />
        </Grid>
      ))}
    </Grid>
  );
};

export default LinkerList;
