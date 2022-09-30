import React from 'react';

export default function FollowFavorite({
  user,
  manageAuthorSubscription,
  profile,
  favoritesCount,
  username,
}) {
  const getFollowText = () => {
    if (!user) {
      return 'Follow';
    }
    return profile?.following ? 'Unfollow' : 'Follow';
  };

  return (
    <>
      <button
        className='btn btn-sm btn-outline-secondary'
        onClick={() => manageAuthorSubscription(profile.following)}
      >
        <i className='ion-plus-round'></i>
        &nbsp; {getFollowText()} {username} <span className='counter'></span>
      </button>
      &nbsp;&nbsp;
      <button className='btn btn-sm btn-outline-primary'>
        <i className='ion-heart'></i>
        &nbsp; Favorite Post <span className='counter'>({favoritesCount})</span>
      </button>
    </>
  );
}
