import * as express from 'express';

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
    res.json('Hello world !');
});

app.listen(5000, () => console.log('listening on port 5000'));
