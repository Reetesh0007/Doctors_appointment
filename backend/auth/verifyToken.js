import  jwt  from "jsonwebtoken";
import Doctor from "../modals/DoctorSchema.js";
import User from "../modals/UserSchema.js";

export const authenticate= async (req,res,next)=>{

    const authToken=req.headers.authorization

    if(!authToken || !authToken.startsWith('Bearer')){
        return res.status(401).json({success:false, message:'No token , authorization denied'})
    }

    try {
        const token=authToken.split(" ")[1];

        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.userId=decoded.id
        req.role=decoded.role



        next();       
    } catch (err) {
        if(err.name=='TokenExpireError'){
            return res.status(401).json({message:'Token has Expired'})
        }
        return res.status(401).json({success:false,message:'Token has Expired'})
        
    }

}

export const restrict= roles=>async(req,res,next)=>{
    const userId=req.userId;

    let user;

    const patient=await User.findById(userId);
    const doctor=await Doctor.findById(userId);

    if(patient){
        user=patient;
    }
    if(doctor){
        user=doctor;
    }

    if(!roles.includes(user.role)){
        return res.status(401).json({success:false,message:"You are not authorized"});
    }

    next();
};