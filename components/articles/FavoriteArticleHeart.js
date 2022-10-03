import { useFavoriteArticle } from '../../hooks/useFavoriteArticle';
import { useSWRConfig } from 'swr';
import { Spinner } from '../Spinner';

export const FavoriteArticleHeart = ({
  slug,
  manageFavorite,
  favoritesTotal,
  isFavoriteButtonDisabled,
}) => {
  const { mutate } = useSWRConfig();
  const { favoritedArticle, isLoading } = useFavoriteArticle(slug);

  if (isLoading) {
    return <Spinner />;
  }

  const onClickButton = async () => {
    await manageFavorite(favoritedArticle);
    mutate(`../api/articles/${slug}/favorite`);
  };

  return (
    <>
      <button
        className={`btn btn-sm pull-xs-right ${
          favoritedArticle ? 'btn-primary' : 'btn-outline-primary'
        }`}
        onClick={onClickButton}
        disabled={isFavoriteButtonDisabled}
      >
        <i className='ion-heart'></i> {favoritesTotal}
      </button>
    </>
  );
};
