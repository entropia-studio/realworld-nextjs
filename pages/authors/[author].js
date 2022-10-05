import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArticleRow } from '../../components/articles/ArticleRow';
import FollowAuthor from '../../components/articles/FollowAuthor';
import { Layout } from '../../components/Layout';
import { getAuthorArticles, getProfile } from '../../lib/api';

export default function Authors({ articles, profile, author }) {
  const [articlesFiltered, setArticles] = useState(articles);
  const [isFollowButtonDisabled, setIsFollowButtonDisabled] = useState(false);
  const { username } = profile;
  const { user } = useUser();
  const router = useRouter();

  const MY_ARTICLES = 'My Articles';
  const FAVORITED_ARTICLES = 'Favorited Articles';

  const [selectedTab, setSelectedTab] = useState(MY_ARTICLES);

  const manageAuthorSubscription = async (following) => {
    if (!user) {
      router.push(`/api/auth/login`);
      return;
    }
    const options = {
      method: following ? 'DELETE' : 'POST',
    };
    setIsFollowButtonDisabled(true);
    await fetch(`/api/follow/${username}`, options);
    setIsFollowButtonDisabled(false);
  };

  const selectTab = async (tab) => {
    setSelectedTab(tab);
    if (tab === MY_ARTICLES) {
      setArticles(articles);
    } else if (tab === FAVORITED_ARTICLES) {
      const endpoint = `/api/articles?favorited=${author}`;
      const articlesResponse = await fetch(endpoint);
      const articlesJson = await articlesResponse.json();
      setArticles(articlesJson.articles);
    }
  };

  return (
    <Layout>
      <div className='profile-page'>
        <div className='user-info'>
          <div className='container'>
            <div className='row'>
              <div className='col-xs-12 col-md-10 offset-md-1'>
                {profile.image && (
                  <Image
                    src={profile.image}
                    width='100'
                    height='100'
                    className='user-img'
                    alt={author}
                  ></Image>
                )}
                <h4>{profile.name}</h4>
                {profile.bio && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: profile.bio,
                    }}
                  />
                )}
                {user?.nickname === username ? (
                  <Link href='/settings'>
                    <a
                      className='btn btn-sm btn-outline-secondary action-btn'
                      role='button'
                    >
                      <i className='ion-gear-a'></i> Edit Profile Settings
                    </a>
                  </Link>
                ) : (
                  <FollowAuthor
                    username={username}
                    manageAuthorSubscription={manageAuthorSubscription}
                    isFollowButtonDisabled={isFollowButtonDisabled}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='container'>
          <div className='row'>
            <div className='col-xs-12 col-md-10 offset-md-1'>
              <div className='articles-toggle'>
                <ul className='nav nav-pills outline-active'>
                  <li className='nav-item'>
                    <a
                      className={`nav-link ${
                        selectedTab === MY_ARTICLES ? 'active' : ''
                      }`}
                      role='button'
                      onClick={() => selectTab(MY_ARTICLES)}
                    >
                      My Articles
                    </a>
                  </li>

                  <li className='nav-item'>
                    <a
                      className={`nav-link ${
                        selectedTab === FAVORITED_ARTICLES ? 'active' : ''
                      }`}
                      role='button'
                      onClick={() => selectTab(FAVORITED_ARTICLES)}
                    >
                      Favorited Articles
                    </a>
                  </li>
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
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { author } = params;
  const articles = await (await getAuthorArticles(author)).articles;
  const profile = await getProfile(author);
  return {
    props: {
      articles,
      profile,
      author,
    },
  };
}
