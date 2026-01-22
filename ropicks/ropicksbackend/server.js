
import dotenv from 'dotenv';


import app from './src/app.js';
import sequelize from './src/confing/db.js';

dotenv.config();
const PORT = process.env.PORT || 9000;
const startServer = async ()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('DataBase connencted')
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});

    }catch(error){
        console.error('DB ERROR', error);

    }
    };
    startServer();


