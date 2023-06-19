import App from './app';
import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8800;

const app: App = new App();

app.init().then(() => {
    app.server.listen(PORT, () => console.log(`Starting on port ${PORT}`));
});
