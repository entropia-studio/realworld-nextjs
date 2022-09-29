import { useRouter } from 'next/router';
import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { API_URL } from '../../lib/api';

export default function Editor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: 'POST',
      body: JSON.stringify({
        article: {
          title,
          description,
          body,
          tags,
        },
      }),
    };
    const articleResp = await fetch(`${API_URL}/articles`, options);

    const articleJson = await articleResp.json();

    router.push(`../articles/${articleJson.article.slug}`);
  };

  return (
    <Layout>
      <div className='editor-page'>
        <div className='container page'>
          <div className='row'>
            <div className='col-md-10 offset-md-1 col-xs-12'>
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <fieldset className='form-group'>
                    <input
                      type='text'
                      name='title'
                      className='form-control form-control-lg'
                      placeholder='Article Title'
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className='form-group'>
                    <input
                      type='text'
                      name='description'
                      className='form-control'
                      placeholder="What's this article about?"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className='form-group'>
                    <textarea
                      name='body'
                      className='form-control'
                      rows='8'
                      placeholder='Write your article (in markdown)'
                      onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                  </fieldset>
                  <fieldset className='form-group'>
                    <input
                      type='text'
                      name='tags'
                      className='form-control'
                      placeholder='Enter tags'
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <div className='tag-list'></div>
                  </fieldset>
                  <button
                    className='btn btn-lg pull-xs-right btn-primary'
                    type='submit'
                  >
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
