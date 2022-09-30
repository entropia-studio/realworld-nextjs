import { Layout } from '../components/Layout';
import Link from 'next/link';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { API_URL } from '../lib/api';
import { useState } from 'react';
import useSWR from 'swr';
import { convert } from 'html-to-text';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Setting({ user }) {
  const { data, error } = useSWR(`${API_URL}/user`, fetcher);
  const [image, setImage] = useState(data?.user.image);
  const [bio, setBio] = useState(convert(data?.user.bio));
  const [formDisabled, setFormDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        user: {
          username: user.nickname,
          image,
          bio,
        },
      }),
    };
    setFormDisabled(true);
    const userResp = await fetch(`${API_URL}/user`, options);
    const userJson = await userResp.json();
    setFormDisabled(false);
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <div className='settings-page'>
        <div className='container page'>
          <div className='row'>
            <div className='col-md-6 offset-md-3 col-xs-12'>
              <h1 className='text-xs-center'>Your Settings</h1>
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className='form-group'>
                    <input
                      className='form-control'
                      type='text'
                      placeholder='URL of profile picture'
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className='form-group'>
                    <input
                      className='form-control form-control-lg'
                      type='text'
                      placeholder='Your username'
                      value={user.nickname}
                      disabled
                    />
                  </fieldset>
                  <fieldset className='form-group'>
                    <textarea
                      className='form-control form-control-lg'
                      rows='8'
                      placeholder='Short bio about you'
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </fieldset>
                  <button
                    className='btn btn-lg btn-primary pull-xs-right'
                    disabled={formDisabled}
                  >
                    Update Settings
                  </button>
                </fieldset>
              </form>
              <hr></hr>
              <Link href='/api/auth/logout'>
                <button
                  className='btn btn-outline-danger'
                  ng-click='$ctrl.logout()'
                >
                  Or click here to logout.
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
