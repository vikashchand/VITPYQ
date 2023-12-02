const express=require('express');
const Router =express.Router();


const userService=require('../Services/userServices');

Router.get('/login',userService.userLogin);

module.exports=Router