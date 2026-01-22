import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'; 

 export const register = async (req,res) => {
    try{
 const {fullName ,email,password,confirmPassword} = req.body ;
 if (password != confirmPassword) {
    return res.status(400).json({message :'Password is not macth Check in '});
 }
 const existingUser = await User.findOne ({where :{email}});
 if (existingUser){
    return res.status(400).json({message:'This Email is Allready used login '})
 }
 const hashPassword = await bcrypt.hash(password,10);
 const user = await User.create({
    fullName,
    email,
    password :hashPassword
 });
 return res.status(201).json({message: 'User Created Succssfuly',
    user:{
        id: user.id,
        email: user.email,
        role: user.role
    }
});
    }catch(error){
           return res.status(500).json({message:'error check your connenct'});
    };
 };

 export const login = async (req,res)=>{
    try{  
        
        const {email,password} = req.body;

        const user = await User.findOne({where:{email}});
if (!user){
    return res.status(400).json({message:'User not found please register'});
}
const isMatch = await bcrypt.compare(password,user.password);
if (!isMatch){
    return res.status(400).json({message:'Invalid credentials'});

};
const token =  jwt.sign( 
    {
    id: user.id ,
    role: user.role,
},

process.env.JWT_SECRET,
{expiresIn :'1d'}

);
return res.status(200).json({message:'Login Sucessfuly',token});
}
catch(error){
    return res.status(500).json({message:'error check your connenct and try again'});


   }

 };