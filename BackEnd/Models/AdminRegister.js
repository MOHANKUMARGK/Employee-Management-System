let mongoose=require("mongoose")

let RegisterSchema=mongoose.Schema({
    email:{type:String,
        required:true,
        unique:true
    },
    password:{type:String,
        required:true,
        unique:true
    }
})

let AdminRegister=mongoose.model("AdminRegister",RegisterSchema)

module.exports={AdminRegister}