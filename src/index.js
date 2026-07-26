import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})


import connectDB from "./db/index.js";
import app from "./app.js";




/*connectDB()
.then(() => {

    app.listen(8000, "0.0.0.0", () => {
        console.log("SERVER RUNNING ON PORT 8000");
    })

})
.catch((error)=>{
    console.log("mongodb connection failed", error)
})*/

connectDB()
    .then(() => {
        app.listen(process.env.PORT ||8000, () => {
            console.log(`App is listening in port :${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("mongodb connection failed", error)
    })












/*const app = expresss()

    ; (async () => {
        try {

            await mongoose.connect(`${process.env.MO0NGODB_URI}/${DB_NAME}`)

            app.on("error", (error) => {
                console.log('errror: cannot connnect to database', error)
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on ${process.env.PORT}`)
            })


        } catch (error) {

            console.log("Error", error)
            throw error;

        }
    })()
        */