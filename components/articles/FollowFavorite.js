import React from 'react';

export default function FollowFavorite({
  user,
  manageAuthorSubscription,
  profile,
  username,
  favorited,
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
        className='btn btn-sm btn-primary'
        onClick={() => manageAuthorSubscription(profile.following)}
      >
        <i className='ion-plus-round'></i>
        &nbsp; {getFollowText()} {username} <span className='counter'></span>
      </button>
      &nbsp;&nbsp;
    </>
  );
}
