const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

app.use("/static", express.static("public"))

app.listen(port, ()=>{
    console.log("app is listening on port 3000")
});

app.get("/api/timestamp/:word", (req,res)=>{
    let unixTest = /[^0-9]/g;
    let dateTest = /^[0-9]{4,4}-[0-9]{2,2}-[0-9]{2,2}$/;

    if (!req.params.word.match(unixTest)){
        let milisecond = parseInt(req.params.word);
        let date = new Date(milisecond);

        res.send({
            unix: parseInt(req.params.word),
            "utc": date.toUTCString()
        });
    }
    else if (dateTest.test(req.params.word)){
        let dateSplit = req.params.word.split("-");
        //jamnya 7, karena beda 7 jam sama East Time, Date() kita WIB
        let date = new Date(parseInt(dateSplit[0]), parseInt(dateSplit[1])-1, parseInt(dateSplit[2]), 7, 0, 0);
        let x = dateSplit[0];
        let dateUTC = date.toUTCString();
        let dateUNIX = date.getTime()/1000;

        res.json({
            "unix": dateUNIX*1000,
            "utc": dateUTC,
        })
    }
    res.json({"error": "Invalid Date"});
})