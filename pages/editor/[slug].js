import { useRouter } from 'next/router';
import { API_URL, getArticleBySlug } from '../../lib/api';
import { Layout } from '../../components/Layout';
import { ArticleForm } from '../../components/articles/ArticleForm';

export default function SlugEditor({ article }) {
  const router = useRouter();

  const { slug } = article;

  const onUpdateArticle = async (article) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        article,
      }),
    };

    const articleResp = await fetch(`${API_URL}/articles/${slug}`, options);
    const articleJson = await articleResp.json();
    router.push(`../articles/${articleJson.article.slug}`);
  };

  return (
    <Layout>
      <ArticleForm onUpdateArticle={onUpdateArticle} article={article} />
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const article = (await getArticleBySlug(slug)).article;
  return {
    props: {
      article,
    },
  };
}
