import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { ArticleForm } from '../components/articles/ArticleForm';
import { Layout } from '../components/Layout';

export default withPageAuthRequired(function EditorPage() {
  const router = useRouter();

  const onNewArticle = async (article) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        article,
      }),
    };

    const articleResp = await fetch(`/api/articles`, options);
    const articleJson = await articleResp.json();
    router.push(`/articles/${articleJson.slug}`);
  };

  return (
    <Layout>
      <ArticleForm onNewArticle={onNewArticle} />
    </Layout>
  );
});
