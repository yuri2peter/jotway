import { LazyExoticComponent, Suspense } from 'react';

// project import
import Loader, { LoaderProps } from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable =
  (Component: LazyExoticComponent<React.FC<{}>>) => (props: LoaderProps) =>
    (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );

export default Loadable;
