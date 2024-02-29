const express = require('express')
const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    completed: {
        type: Boolean,
        required: true
    },
    name:{
        type:String,
        required:true
    }
   
});

const cardData = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        required:true
    },
    tasks:{
        type:[taskSchema],
        required:true
    },
    date:{
        type:String,
        required:false
    },
    group:{
        type:String,
        required:true
    },
    logdate:{
        type:Date,
        required:true
    }
})




module.exports = mongoose.model("cardData",cardData)
