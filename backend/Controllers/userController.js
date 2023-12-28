import User from "../modals/UserSchema.js";
import Booking from "../modals/BookingSchema.js";
import Doctor from "../modals/DoctorSchema.js";

export const updateUser=async(req,res)=>{
    const id=req.params.id

    try {
        const updatedUser=await User.findByIdAndUpdate(id,{$set:req.body},{new:true})

        res.status(200).json({success:true,message:'Successfully Updated',data:updatedUser})
        
    } catch (err) {
        res.status(500).json({success:false,message:'Failed to update'})
        
    }

}

export const deleteUser=async(req,res)=>{
    const id=req.params.id

    try {
      await User.findByIdAndDelete(id,  )

        res.status(200).json({success:true,message:'Successfully Deleted'})
        
    } catch (err) {
        res.status(500).json({success:false,message:'Failed to delete'})
        
    }

}

export const getSingleUser=async(req,res)=>{
    const id=req.params.id

    try {
        const user=await User.findById(id).select("-password");

        res.status(200).json({success:true,message:'User found',data:user})
        
    } catch (err) {
        res.status(404).json({success:false,message:'No user found'})
        
    }

}

export const getAllUser=async(req,res)=>{

    try {
        const users=await User.find({}).select("-password");

        res.status(200).json({success:true,message:'Users found',data:users})
        
    } catch (err) {
        res.status(404).json({success:false,message:'Not found'})
        
    }

};

export const getUserProfile=async(req,res)=>{
    const userId=req.userId

    try {
        const user=await User.findById(userId)

        if(!user){
            return res.status(404).json({success:false,message:'User not found'})
        }

        const {password, ...rest}=user._doc

        res.status(200).json({success:true,message:'Profile Info is getting',data:{...rest}})
    



    } catch (error) {
        res.status(500).json({success:false,message:'Something went wrong,cannot get'})
        
    }
}

export const getMyAppointments=async(req,res)=>{
    try {

        const bookings=await Booking.find({user:req.userId})

        const doctorIds=bookings.map(el=>el.doctor.id)

        const doctors=await Doctor.find({_id:{$in:doctorIds}}).select('-password')

        res.status(200).json({success:true,message:'Appointments are getting',data:doctors})
        
    } catch (err) {
        res.status(500).json({success:false,message:'Something went wrong,cannot get'})
    }
}