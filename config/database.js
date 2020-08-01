const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGODB_URL,
        {
            ursNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log('MongoDB connected..'))
    .catch(err => console.log(err.message));

    
