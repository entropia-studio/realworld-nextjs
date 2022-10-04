import { ArticleRow } from '../components/articles/ArticleRow';
import { Tags } from '../components/Tags';
import { getTags, getArticles, API_URL } from '../lib/api';
import { Layout } from '../components/Layout';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export default function Home({ tags, articles }) {
  const YOUR_FEED = 'Your Feed';
  const GLOBAL_FEED = 'Global Feed';

  const [selectedTab, setSelectedTab] = useState(GLOBAL_FEED);

  const { user } = useUser();

  const [articlesFiltered, setArticles] = useState(articles);

  const selectTab = async (tab) => {
    const isTagTab = (tab) => tags.some((tag) => tab === tag);

    setSelectedTab(tab);
    let endpoint = `${API_URL}/articles`;
    if (tab === YOUR_FEED) {
      endpoint = `${endpoint}/feed`;
    } else if (isTagTab(tab)) {
      endpoint = `${endpoint}?tag=${tab}`;
    }
    const articlesResponse = await fetch(endpoint);
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
                            selectedTab === YOUR_FEED ? 'active' : ''
                          }`}
                          onClick={() => selectTab(YOUR_FEED)}
                          role='button'
                        >
                          {YOUR_FEED}
                        </a>
                      </li>
                    )}
                    <li className='nav-item'>
                      <a
                        className={`nav-link ${
                          selectedTab === GLOBAL_FEED ? 'active' : ''
                        }`}
                        onClick={() => selectTab(GLOBAL_FEED)}
                        role='button'
                      >
                        {GLOBAL_FEED}
                      </a>
                    </li>
                    {tags.some((tag) => tag === selectedTab) && (
                      <li className='nav-item'>
                        <a className={`nav-link active`} role='button'>
                          #{selectedTab}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
                {articlesFiltered?.length > 0 ? (
                  articlesFiltered?.map((article) => (
                    <ArticleRow article={article} key={article.id} />
                  ))
                ) : (
                  <div className='row p-t-1' style={{ width: '100%' }}>
                    <div className='col'>No articles are here... yet</div>
                  </div>
                )}
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
