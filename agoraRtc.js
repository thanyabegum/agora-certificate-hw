let handlefail = function(err){
    console.log(err)
}

function addVideoStream(streamId, i){
    console.log("Displaying Stream");
    let remoteContainer = document.getElementById("remote-stream-" + i);
    remoteContainer.style.opacity = "1";
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "145px";
    remoteContainer.appendChild(streamDiv);
}

document.getElementById("join").onclick = function () {
    let channelname = document.getElementById("channelname").value;
    let username = document.getElementById("username").value;
    let appId = "cff99ecf798d4e0fa9d08fc8ba630b22";
    let i = 1;
    let j = 2;

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"), handlefail)

    client.join(
        null,
        channelname,
        username,
        () => {
            console.log("Client joined channel");

            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function() {
                let selfStreamContainer = document.getElementById("self-stream");
                selfStreamContainer.style.opacity = "1";
                localStream.play("self-stream")
                console.log(`App id: ${appId}\nChannel id: ${channelname}`)
                client.publish(localStream)
            })

            document.getElementById("name-1").innerHTML = username;
        }
    )

    client.on("stream-added", function (evt) {
        console.log("Added Stream");
        client.subscribe(evt.stream, handlefail)
    })

    client.on("stream-subscribed", function(evt) {
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId(), i);
        stream.play(stream.getId());
        i++;
    })

    client.on("peer-online", function(evt) {
        console.log("Peer Online");
        document.getElementById("name-" + j).innerHTML = evt.uid;
        j++;
      });
}