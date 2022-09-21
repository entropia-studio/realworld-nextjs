import React from 'react';

export const Page = ({ pageData, layout }) => {
  return <div>[slug]</div>;
};

export async function getStaticPaths() {
  const paths = await getAllPageSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const pageData = await getPageDataBySlug(params.slug);
  const layout = await (await getDataByContentType('layout')).items[0].fields;

  return {
    props: {
      pageData,
      layout,
    },
  };
}
