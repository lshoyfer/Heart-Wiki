// didnt work, 2 hour headache. I give up.
// using parallel server & client state instead
// which is much faster anyways

export default async function handler(req, res) {
    // Check for secret to confirm this is a valid request
    console.log('\n\n\nRECEIVED REVALIDATE\n\n\n', req.query);
    console.log(req, '\n\n\n', res);
    if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        // This should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        console.log('in here', req.query.id);
        await res.revalidate(`/convo/${req.query.id}`);
        console.log('\n\n\nSENDING REVALIDATE\n\n\n');
        return res.json({ revalidated: true });
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        console.log(err);
        return res.status(500).send('Error revalidating');
    }
}
