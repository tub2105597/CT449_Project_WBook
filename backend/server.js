const app = require('./app');
const config = require('./app/config');
const MongoDB = require('./app/utils/mongodb.util');

async function startServer() {
    try {

        await MongoDB.connect(config.mongodb.uri);
        console.log('Connected to MongoDB');

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Cannot connect to the database!', error);
        process.exit();
    }
}

startServer();