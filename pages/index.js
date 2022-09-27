import { ArticleRow } from '../components/articles/ArticleRow';
import { Tags } from '../components/Tags';
import { getTags, getArticles } from '../lib/api';
import { Layout } from '../components/Layout';

export default function Home({ tags, articles }) {
  return (
    <Layout>
      <div className='home-page'>
        <div className='home-page'>
          <div className='banner'>
            <div className='container'>
              <h1 className='logo-font'>conduit</h1>
              <p>A place to share your knowledge.</p>
            </div>
          </div>
          <div className='container page'>
            <div className='row'>
              <div className='col-md-9'>
                <div className='feed-toggle'>
                  <ul className='nav nav-pills outline-active'>
                    <li className='nav-item'>
                      <a className='nav-link disabled' href=''>
                        Your Feed
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link active' href=''>
                        Global Feed
                      </a>
                    </li>
                  </ul>
                </div>
                {articles.map((article) => (
                  <ArticleRow article={article} key={article.id} />
                ))}
              </div>
              <Tags tags={tags} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const tags = (await getTags()).tags;
  const articles = (await getArticles()).articles;
  return {
    props: { tags, articles },
  };
}
