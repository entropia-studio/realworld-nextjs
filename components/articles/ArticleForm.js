import React, { useState } from 'react';
import { removeTags } from '../../lib/util';

export const ArticleForm = ({ article, onNewArticle, onUpdateArticle }) => {
  const [title, setTitle] = useState(article?.title);
  const [description, setDescription] = useState(
    removeTags(article?.description)
  );
  const [body, setBody] = useState(removeTags(article?.body));
  const [tags, setTags] = useState(article?.tagList?.toString());

  const handleSubmit = async (e) => {
    e.preventDefault();

    const articlePayload = {
      title,
      description,
      body,
      tags,
    };

    if (article?.title) {
      onUpdateArticle(articlePayload);
    } else {
      onNewArticle(articlePayload);
    }
  };

  return (
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </fieldset>
                <fieldset className='form-group'>
                  <input
                    type='text'
                    name='description'
                    value={description}
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
                    value={body}
                  ></textarea>
                </fieldset>
                <fieldset className='form-group'>
                  <input
                    type='text'
                    name='tags'
                    className='form-control'
                    placeholder='Enter tags'
                    value={tags}
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
  );
};
