let mongoose=require("mongoose")

let url='mongodb://localhost:27017/Employee_Management_System'

let dbConnect=async()=>{
    try {
       mongoose.connect(url)
       console.log("Database Connected"); 
    } catch (error) {
       console.log("Something error while connecting",error); 
    }
}

module.exports={dbConnect}