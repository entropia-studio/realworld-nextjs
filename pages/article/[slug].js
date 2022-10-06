import { getArticleBySlug } from '../../lib/api';
import { Layout } from '../../components/Layout';
import { ArticleForm } from '../../components/articles/ArticleForm';

export default function SlugEditor({ article }) {
  const { slug } = article;

  const onUpdateArticle = async (article) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        article,
      }),
    };

    const articleResp = await fetch(`/api/articles/${slug}`, options);
    const articleJson = await articleResp.json();
    setTimeout(() => {
      window.location = `/articles/${articleJson.article.slug}`;
    }, 2500);
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
