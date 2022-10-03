import { ArticleRow } from '../components/articles/ArticleRow';
import { Tags } from '../components/Tags';
import { getTags, getArticles } from '../lib/api';
import { Layout } from '../components/Layout';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export default function Home({ tags, articles }) {
  const [selectedTab, setSelectedTab] = useState('Global Feed');

  const { user } = useUser();

  const [articlesFiltered, setArticles] = useState(articles);

  const selectTab = async (tab) => {
    setSelectedTab(tab);
    const articlesResponse = await fetch(`/api/articles?tag=${tab}`);
    const articlesJson = await articlesResponse.json();
    setArticles(articlesJson.articles);
  };

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
                    {user && (
                      <li className='nav-item'>
                        <a
                          className={`nav-link ${
                            selectedTab === 'Your feed' ? 'active' : ''
                          }`}
                          onClick={() => selectTab('Your feed')}
                        >
                          Your Feed
                        </a>
                      </li>
                    )}
                    <li className='nav-item'>
                      <a
                        className={`nav-link ${
                          selectedTab === 'Global Feed' ? 'active' : ''
                        }`}
                        onClick={() => selectTab('Global Feed')}
                      >
                        Global Feed
                      </a>
                    </li>
                    {tags.some((tag) => tag === selectedTab) && (
                      <li className='nav-item'>
                        <a className={`nav-link active`}>#{selectedTab}</a>
                      </li>
                    )}
                  </ul>
                </div>
                {articlesFiltered?.length &&
                  articlesFiltered?.map((article) => (
                    <ArticleRow article={article} key={article.id} />
                  ))}
              </div>
              <Tags tags={tags} selectTab={selectTab} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const tags = (await getTags()).tags ?? null;
  const articles = (await getArticles()).articles;
  return {
    props: { tags, articles },
  };
}
