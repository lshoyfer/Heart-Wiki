
// import 'server-only';
import deleteUser from '../../utils/deleteUser';

export default async function handler(req, res) {
    console.log('\nIN API\nREQ:', req.headers);
    if ((req.method === 'POST') && (req.headers['content-type'] === 'application/json')) {
        const userIDs = req.body;
        await deleteUser(userIDs);
        res.status(200).send("Successfully deleted user.");
    } else {
        res.status(401).send("NOT ALLOWED");
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
}