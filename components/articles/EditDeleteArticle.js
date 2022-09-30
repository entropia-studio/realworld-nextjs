import React from 'react';

export default function EditDeleteArticle({ editArticle, deleteArticle }) {
  return (
    <>
      <button
        className='btn btn-outline-secondary btn-sm'
        onClick={editArticle}
      >
        <i className='ion-edit'></i>
        &nbsp; Edit article
      </button>
      &nbsp;&nbsp;
      <button className='btn btn-outline-danger btn-sm' onClick={deleteArticle}>
        <i className='ion-trash-a'></i>
        &nbsp; Delete article
      </button>
    </>
  );
}
