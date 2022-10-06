export default async function handler(req, res) {
  if (req.headers.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const body = JSON.parse(req.body);
    const slug = body?.fields?.slug['en-US'];
    await res.revalidate(`/articles/${slug}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send(`Error revalidating ${err.message}`);
  }
}
