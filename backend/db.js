import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/';

const connectToMongo = async () => {
    try {
        mongoose.connect(mongoURI);
        console.log('Connected to Mongo Successfully');
    }
    catch (e) {
        console.log(e);
    }
}

export default connectToMongo
