const express = require('express');
const app = express();
var server = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const models = require('./Models');
const { Op } = require("sequelize");

const functions = require('./utils/functions');
const bodyParser = require('body-parser');
const Connection = require('./connection');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(__dirname + '/uploads'));

//import Routes
const User = require('./routes/user');
const Deal = require('./routes/deal');




app.use('/', async (req, res, next) => {
    Connection.authenticate()
        .then(
            () => { console.log("Database connected..."), next() },
            error=>{ console.log("Database connection error",error) }
        )
        .catch(err => { console.log('database connection error', err), res.redirect('/error') });
})

app.use('/sync_db',(req,res)=>{
    Connection.sync({ alter: true }).then(
        ()=>{
            res.json({
                status:'success'
            })
        }
    )
});

app.use('/initial_data',async(req,res)=>{
    var deals,deals=[];
    let date = new Date();
    let current_time = functions.getFormattedTime(date);
    models.deal.findAll({
       where:{
           time:{
               [Op.gte]:current_time,
           }
       },
       include:[
           {
               model:models.user,
               attributes:{exclude:['email','password']}
           }
       ]
    })
    .then(data=>{
        deals=data;
        res.json({
            deals:deals,
        })
    })
})

app.use('/user', User);
app.use('/deal',Deal)

//to show error
app.use('/error', (req, res, next) => {
    res.send("connection not authenticated")
})
server.listen(52000, () => console.log("server is listening at port 52000"))
