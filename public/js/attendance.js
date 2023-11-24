const button = document.querySelector(".gen-btn");
const image = document.getElementById("qrcode-image");

button.addEventListener('click',()=>{
    let url = document.baseURI.split("/");
    document.getElementById("image-container").style.display = "grid";
    document.getElementById("qrcode-container").style.display = "none";
    let dates = url.slice(-3);
    let method_url = `/teacher/generate/qrcode/${dates[0]}/${dates[1]}/${dates[2]}`;
    fetch(method_url,{
        method:"GET",
    })
    .then(res => res.json())
    .then((data)=>{
        console.log(data)
        image.src = data.qrcode;
    })
    .catch((err)=>{
        console.log(err);
        alert("Could not generate QR code");
    })
})