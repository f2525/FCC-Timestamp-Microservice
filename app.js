const express = require("express");
const app = express();
const port = 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

app.use("/static", express.static("public"))

//kalau heroku dia pake environment variable untuk PORTnya, jadi harus begini app.listennya
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

app.get("/api/timestamp", (req,res)=>{
    let date = new Date();
    let utcDate = date.toUTCString();
    let unixDate = date.getTime()/1000;
    res.json({
        "unix": unixDate,
        "utc": utcDate
    })
})

app.get("/api/timestamp/:word", (req,res)=>{
    let unixTest = /[^0-9]/g;
    let dateTest = /^[0-9]{4,4}-[0-9]{2,2}-[0-9]{2,2}$/;

    if (!req.params.word.match(unixTest)){
        let milisecond = parseInt(req.params.word);
        let date = new Date(milisecond);

        res.json({
            unix: parseInt(req.params.word),
            "utc": date.toUTCString()
        });
    }
    else if (dateTest.test(req.params.word)){
        let dateSplit = req.params.word.split("-");
        //jamnya 7, karena beda 7 jam sama East Time, Date() kita WIB. ini hanya berlaku untuk localhost, kalau untuk heroku 0 aja karena servernya di US
        let date = new Date(parseInt(dateSplit[0]), parseInt(dateSplit[1])-1, parseInt(dateSplit[2]), 0, 0, 0);
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