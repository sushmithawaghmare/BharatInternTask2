var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/moneylist", { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to the database"));
db.once('open', () => console.log("Connected to database"));


var MoneyModel = mongoose.model('Money', {
    Category: String,
    Amount: Number,
    Info: String,
    Date: Date
});

app.post("/add", async (req, res) => {
    var category_select = req.body.category_select;
    var amount_input = req.body.amount_input;
    var info = req.body.info;
    var date_input = req.body.date_input;

    var newData = new MoneyModel({
        Category: category_select,
        Amount: amount_input,
        Info: info,
        Date: date_input
    });

    try {
        await newData.save();
        console.log("Record inserted successfully");
        res.status(200).send("Record inserted successfully");
    } catch (err) {
        console.error("Error inserting record:", err);
        res.status(500).send("Error inserting record");
    }
});
app.get("/data", async (req, res) => {
    try {
        const data = await MoneyModel.find();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Error fetching data");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    res.redirect('index.html');
});

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
