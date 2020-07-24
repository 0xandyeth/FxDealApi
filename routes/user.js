const express = require('express');
const router = express.Router();
const models = require('../Models');
const sequelize=require('sequelize')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {authenticateJWT}=require('../middleware');
const multer = require("multer");


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/profiles/"); //here we specify the destination. in this case i specified the current directory
    },
    filename: function(req, file, cb) {
        var temp_array=file.originalname.split(".");
        var file_name=temp_array[0]+Date.now()+"."+temp_array[1];
        cb(null, file_name);//here we specify the file saving name. in this case.
    }
});

var uploadDisk = multer({ storage: storage });
const { saltRounds,accessTokenSecret, smtpTransport} = require("../config");

router.post('/register',async(req,res,next)=>{
   
     var {firstName,lastName,userName,phoneNumber,country,city,email,password} =req.body;


     
     models.user.create({
        firstName:firstName,
        lastName:lastName,
        userName:userName,
        phoneNumber:phoneNumber,
        country:country,
        city:city,
        email:email,
        password:await bcrypt.hash(password,saltRounds)
     }).then(data=>{
      
            const accessToken=jwt.sign({user_id:data.id},accessTokenSecret);
            res.json({status:'success',msg:'hello',user:data,accessToken:accessToken})
     
     },
     error=>{
         res.json({status:'error',msg:error.errors[0].message})
     }
     )
});
router.post('/login',async(req,res,next)=>{
    var {email,password} = req.body

    models.user.findAll({
        where:{
            email:email
        }
    }).then(
        async data=>{
            if(data.length>0){
                let password_check=await bcrypt.compare(password,data[0].password);
                if(password_check){
                    let user=data[0];
                    const accessToken=jwt.sign({user_id:user.id},accessTokenSecret);
                    res.json({status:'success',user:data[0],accessToken:accessToken})
                }else{
                    res.json({status:'error',msg:'password does not match'})
                }
            }else{
                res.json({status:'error',msg:'email does not exist'})
            } 
        },
        error=>{
            res.json({status:'error'})
        }
    )
})

module.exports = router;
