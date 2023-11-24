const qrcode = require("qrcode");

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const class_details = (req,res)=>{
    let { day , month , year } = req.params;

    month = months[month];

    let data = `${day}-${month}-${year}`;

    res.render("attendance_display",{ data });
}

const generate_qrcode = (req,res)=>{
    try{

        let { year , month , day } = req.params;
    
        let data = {
            year,
            month,
            day,
        };
    
        data = `http://localhost:8080/qrcode/${data.year}/${data.month}/${data.day}`;
        
        qrcode.toDataURL(data,(err,qr)=>{
            if(err)
            {
                console.log(err);
                return res.status(400).send(err);
            }
            console.log(qr)
            res.status(200).send({
                message: "QR code generated",
                qrcode: qr,
            });
        })
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}


module.exports = {
    class_details,
    generate_qrcode,
}