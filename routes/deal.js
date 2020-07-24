const express = require('express');
const router = express.Router();
const models = require('../Models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {authenticateJWT}=require('../middleware');
const multer = require("multer");
// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "./uploads/events/");
//     },
//     filename: function(req, file, cb) {
//         var temp_array=file.originalname.split(".");
//         var file_name=temp_array[0]+Date.now()+"."+temp_array[1];
//         cb(null, file_name);
//     }
// });

// var uploadDisk = multer({ storage: storage });


router.post('/create/:id?',authenticateJWT,async(req,res)=>{
     var id=req.params.id;
     var {name,type,amount,ccy1,ccy2,time} =req.body
     var {user_id}=req.user;
     var update_date={
         userId:user_id,
         name:name,
         type:type,
         amount:amount,
         ccy1:ccy1,
         ccy2:ccy2,
         time:time
     }

     var update_result;
     if(id ===undefined || id ==null){
         update_result=await models.deal.create(update_date);
     }
     else{
        update_result=await models.deal.update(update_data,{where:{id:id},returning: true,plain: true})
        update_result=update_result[1];
     }
     res.json({status:'success',msg:"Deal created successfully", deal:update_result});
})

router.get('/mycreated_deal',authenticateJWT,async(req, res)=>{
    var {user_id}=req.user;
    var user=await models.user.findOne({
        where:{
            id:user_id
        },
        include:[
            {
                model:models.deal
            }
        ]
    });
    res.json({
        deals:user.deals
    })
});



router.post('/delete/:id', async(req, res, next) => {
    var id=req.params.id;
    await models.deal.destroy({
        where:{
            id:id
        }
    })
    res.json({
        status:'success',
        msg:'Deal deleted successfully'
    })
});

module.exports = router;