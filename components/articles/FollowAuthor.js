import { useSWRConfig } from 'swr';
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

  const { mutate } = useSWRConfig();

  const { followedAuthor } = useFollowAuthor(username);

  const onClickButton = async () => {
    await manageAuthorSubscription(followedAuthor);
    mutate(`../api/profiles/${username}`);
  };

  return (
    <>
      <button
        className='btn btn-sm action-btn btn-secondary'
        onClick={onClickButton}
        disabled={isFollowButtonDisabled}
      >
        <i className='ion-plus-round'></i>
        &nbsp; {followMsgMap.get(followedAuthor)} {username}{' '}
        <span className='counter'></span>
      </button>
      &nbsp;&nbsp;
    </>
  );
}
