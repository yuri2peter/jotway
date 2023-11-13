import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticleMain from 'src/components/article/Main';
import { useVisibilityChange } from 'src/hooks/useVisibilityChange';
import { fetchSettings } from 'src/store/state/actions/settings';

const ArticlePage: React.FC<{}> = () => {
  const { id } = useParams();
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    (async () => {
      await fetchSettings();
      setReady(true);
    })();
  }, []);
  // 页面tab激活时，重载数据
  useVisibilityChange(async (visible) => {
    if (visible) {
      await fetchSettings();
    }
  });
  if (!ready || !id) {
    return null;
  }
  return <ArticleMain id={id || ''} />;
};

export default ArticlePage;
