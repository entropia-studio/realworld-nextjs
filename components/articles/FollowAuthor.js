import { useEffect, useState } from 'react';
import { useFollowAuthor } from '../../hooks/useFollowAuthor';

export default function FollowAuthor({
  username,
  manageAuthorSubscription,
  isFollowButtonDisabled,
}) {
  const followMsgMap = new Map([
    [true, 'Unfollow'],
    [false, 'Follow'],
  ]);

  const { followedAuthor } = useFollowAuthor(username);
  const [isFollowed, setIsFollowed] = useState(followedAuthor ?? false);

  useEffect(() => {
    setIsFollowed(followedAuthor);
  }, [followedAuthor]);

  const onClickButton = () => {
    setIsFollowed(!isFollowed);
    manageAuthorSubscription(isFollowed);
  };

  return (
    <>
      <button
        className='btn btn-sm action-btn btn-secondary'
        onClick={onClickButton}
        disabled={isFollowButtonDisabled}
      >
        <i className='ion-plus-round'></i>
        &nbsp; {followMsgMap.get(isFollowed)} {username}{' '}
        <span className='counter'></span>
      </button>
      &nbsp;&nbsp;
    </>
  );
}
