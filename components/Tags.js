import Link from 'next/link';
import React from 'react';

export const Tags = ({ tags }) => {
  return (
    <div className='col-md-3'>
      <div className='sidebar'>
        <p>Popular Tags</p>
        <div className='tag-list'>
          {tags.map((tag) => (
            <Link key={tag} href={`./articles/${tag}`}>
              <a className='tag-pill tag-default'>{tag}</a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
