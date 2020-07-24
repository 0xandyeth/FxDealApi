const {Sequelize,DataTypes} = require('sequelize')

var db = require('./connection')

const user = db.define('user',{
       id:{
           type:DataTypes.INTEGER,
           autoIncrement:true,
           primaryKey:true
       },
       firstName:{
           type:DataTypes.STRING
       },
       lastName:{
           type:DataTypes.STRING
       },
       userName:DataTypes.STRING,
       phoneNumber:DataTypes.STRING,
       email:{
           type:DataTypes.STRING,
           unique:true,
           allowNull:false,
           isEmail:true
       },
       country:DataTypes.STRING,
       city:DataTypes.STRING,
       facebook:DataTypes.STRING,
       google:DataTypes.STRING,
       twitter:DataTypes.STRING,
       password:DataTypes.STRING,

});

const deal =db.define('deal',{
     id:{
         type:DataTypes.INTEGER,
         primaryKey:true,
         autoIncrement:true
     },
     userId:DataTypes.INTEGER,
     name:DataTypes.STRING,
     type:DataTypes.STRING,
     amount:DataTypes.STRING,
     ccy1:DataTypes.STRING,
     ccy2:DataTypes.STRING,
     time:DataTypes.STRING
})

user.hasMany(deal);
deal.belongsTo(user);

module.exports={
    user:user,
    deal:deal,
}