import { useEffect, useState } from 'react';
import { useFavoriteArticle } from '../../hooks/useFavoriteArticle';

export const FavoriteArticle = ({
  slug,
  manageFavorite,
  favoritesTotal,
  isFavoritesLoading,
}) => {
  const favoviteMsgMap = new Map([
    [true, 'Unfavorite'],
    [false, 'Favorite'],
  ]);
  const { favoriteArticle } = useFavoriteArticle(slug);
  const [isFavorite, setIsFavorite] = useState(favoriteArticle ?? false);

  useEffect(() => {
    setIsFavorite(favoriteArticle);
  }, [favoriteArticle]);

  const onClickButton = () => {
    setIsFavorite(!isFavorite);
    manageFavorite(isFavorite);
  };

  return (
    <>
      <button
        className='btn btn-sm btn-primary'
        onClick={onClickButton}
        disabled={isFavoritesLoading}
      >
        <i className='ion-heart'></i>
        &nbsp; {favoviteMsgMap.get(isFavorite)} article{' '}
        <span className='counter'>({favoritesTotal})</span>
      </button>
    </>
  );
};
