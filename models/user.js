const express = require('express')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },

    email: {
        type: String,
        reqired:true
    },

    password: {
        type: String,
        required:true
    },

    confirmPassword: {
        type: String,
        required:true
    },
})

module.exports = mongoose.model("user",userSchema)