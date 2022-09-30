import { useRouter } from 'next/router';
import { ArticleForm } from '../../components/articles/ArticleForm';
import { Layout } from '../../components/Layout';
import { API_URL } from '../../lib/api';

export default function Editor() {
  const router = useRouter();

  const onNewArticle = async (article) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        article,
      }),
    };

    const articleResp = await fetch(`${API_URL}/articles`, options);
    const articleJson = await articleResp.json();
    router.push(`../articles/${articleJson.article.slug}`);
  };

  return (
    <Layout>
      <ArticleForm onNewArticle={onNewArticle} />
    </Layout>
  );
}
