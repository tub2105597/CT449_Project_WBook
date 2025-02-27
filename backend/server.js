const app = require('./app');
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function startServer() {
    try {
        const { PORT, MONGO_LOCAL_URI, NODE_ENV } = process.env;
        console.log('Environment:', NODE_ENV);

        //Connect to mongodb
        await mongoose.connect(MONGO_LOCAL_URI);
        console.log(`Connect to ${MONGO_LOCAL_URI} successfully!`);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('There is some internal error!', error);
        process.exit();
    }
}

startServer();