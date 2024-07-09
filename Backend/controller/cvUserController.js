const Users = require("../models/usersModel");
const CV=require("../models/cvModel")
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secret = "secretWord";


exports.deleteUserCv=async(req,res)=>{
    try {
        const {_id}=req.user

        const {cvIdToDelete}=req.body
        const result = await Users.findOneAndUpdate(
            { _id: _id }, 
            { $pull: { cvs:  cvIdToDelete  } }, 
            { new: true } 
            )
            
            const Cvremove=await CV.findByIdAndDelete(cvIdToDelete)
          res.status(200).json({result,Cvremove});       

          

        
    } catch (error) {
        res.status(500).json({ message: error.massage || "An error occurred "});        
    }

}
exports.updateUserCv=async(req,res)=>{
    try {
        const {_id}=req.user

        const {cvId,updateValue,updateKey}=req.body
        const result = await CV.findOneAndUpdate(
            { _id: cvId }, 
            {[updateKey]:updateValue  }, 
            { new: true } 
            )
            
           
          res.status(200).json({result,Cvremove});       

          

        
    } catch (error) {
        res.status(500).json({ message: error.massage || "An error occurred "});        
    }

}












