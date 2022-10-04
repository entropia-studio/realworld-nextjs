import { useFavoriteArticle } from '../../hooks/useFavoriteArticle';
import { useSWRConfig } from 'swr';
import { Spinner } from '../Spinner';

export const FavoriteArticle = ({
  slug,
  manageFavorite,
  favoritesTotal,
  isFavoriteButtonDisabled,
}) => {
  const { mutate } = useSWRConfig();
  const favoviteMsgMap = new Map([
    [true, 'Unfavorite'],
    [false, 'Favorite'],
  ]);
  const { favoritedArticle, isLoading } = useFavoriteArticle(slug);

  if (isLoading) {
    return <Spinner />;
  }

  const onClickButton = async () => {
    await manageFavorite(favoritedArticle);
    mutate(`${API_URL}/articles/${slug}/favorite`);
  };

  return (
    <>
      <button
        className='btn btn-sm btn-primary'
        onClick={onClickButton}
        disabled={isFavoriteButtonDisabled}
      >
        <i className='ion-heart'></i>
        &nbsp; {favoviteMsgMap.get(favoritedArticle)} article{' '}
        <span className='counter'>({favoritesTotal})</span>
      </button>
    </>
  );
};
