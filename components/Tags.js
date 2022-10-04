export const Tags = ({ tags, selectTab }) => {
  return (
    <div className='col-md-3'>
      <div className='sidebar'>
        <p>Popular Tags</p>
        <div className='tag-list'>
          {tags.map((tag) => (
            <a
              className='tag-pill tag-default'
              onClick={() => selectTab(tag)}
              key={tag}
              role='button'
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
