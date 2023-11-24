const socket = io();

console.log(image.images[0]);


const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({video: true})
    .then((stream)=>{
        video.srcObject = stream;

        let id = setInterval(()=>{
            const canvas = document.createElement("canvas");
            const context = canvas.getContext('2d');
            canvas.width = video.width;
            canvas.heihjt = video.clientHeight;
            context.drawImage(video,0,0,video.width,video.height);

            const dataUrl = canvas.toDataURL('image/jpeg');

            socket.emit('video_frame', { stream: dataUrl , image: image.images[0] });                                                                                                                    
        },5000);

        // socket.on("end-video",()=>{
        //     clearInterval(id);
        // })
    })
    .catch((err)=>{
        console.log("Something Went Wrong!");
        console.log(err)
    })