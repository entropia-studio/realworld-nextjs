import { useFavoriteArticle } from '../../hooks/useFavoriteArticle';
import { useSWRConfig } from 'swr';

export const FavoriteArticleHeart = ({
  slug,
  manageFavorite,
  favoritesTotal,
  isFavoriteButtonDisabled,
}) => {
  const { mutate } = useSWRConfig();
  const { favoritedArticle } = useFavoriteArticle(slug);

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
