"use client";
import { useEffect, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css";
import RcFile from "rc-upload";
import { Upload, message } from "antd";

export default function Page({ params }: { params: { roomId: string } }) {
  const [video, setVideo] = useState<boolean>(true);
  const [audio, setAudio] = useState<boolean>(true);
  const [accessType, setAccessType] = useState<"public" | "askToJoin">(
    "public"
  );
  const [stream, setStream] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [defaultAvatar, setDefaultAvatar] = useState<string>("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  useEffect(() => {
    setAccessType(
      (localStorage.getItem("accessType") as "public" | "askToJoin") || "public"
    );
  }, []);

  const renderVideo = () => {
    //clear body
    document.body.innerHTML = "";

    // insert script tag
    const script = document.createElement("script");
    script.src = "https://meet-lider.it-pfiev-dut.tech/public-sdk.js";
    document.head.appendChild(script);
    script.onload = () => {
      // create div for video <div id="lider-container" style="width: 500px; height: 500px"></div>
      const container = document.createElement("div");
      container.id = "lider-container";
      container.style.width = "100vw";
      container.style.height = "100vh";
      document.body.appendChild(container);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        const lider = new LiderClient("lider-container");
          lider.join({
          inviteUrl: "https://lider.it-pfiev-dut.tech/${params.roomId}", // Invite URL of your room, this field is required and decide the room of your clients
          accessType: "${accessType}", // Access type of your room, we have 2 types: public and askToJoin
          token: "eyJ1c2VySWQiOiI2NDQxNWY1ZDhmM2UxYmE2OTE0NmNhNjEiLCJnZW5Ub2tlbkF0IjoiMjAyMy0wNi0wNFQwOToyNzoyMC41MjdaIn0=!gLjBWOabKQu02fAKR9Wd0G3CH4C8aqgxnmO6AcrcL5A=", // Token of your app
          roomId: "${params.roomId}", // Room ID, this field is required and decide the room of your clients
          user: {
            username: "${name}", // Username of client
            avatar: "${avatar}", // Avatar of client
            video: ${video},
            audio: ${audio},
          },
        });`;
      document.body.appendChild(script2);
    };
  };

  const handleFileUpload = (file: any, response: any) => {
    // Assuming the response data is in JSON format with a 'url' property
    const { url } = response;
    // Do something with the URL
    console.log(url);
    setAvatar(url);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(event.target.value);
  };
  const handleJoinMeeting = () => {
    if (name.trim() === "") {
      return alert("Please enter your name.");
    }

    localStorage.setItem("name", name);
    localStorage.setItem("avatar", name);

    renderVideo();
    // create div for video
    // const video = document.createElement("video");
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
      setVideo(!video);
    }
  };
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setAudio(!audio);
    }
  };

  useEffect(() => {
    // Update the avatar URL when the name changes
    if (name && avatar.trim() === "") {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&size=128`;
      setDefaultAvatar(avatarUrl);
    }
  }, [name]);

  useEffect(() => {
    console.log("useEffect1");
    const video: any = document.getElementById("lider-video");
    console.log("video", video);
    if (video) {
      navigator.mediaDevices
        .getUserMedia({ video, audio })
        .then((cameraStream) => {
          console.log("camera", cameraStream);
          setStream(cameraStream);
          video.srcObject = cameraStream;
          video.play();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [video]);

  useEffect(() => {
    if (name.trim() === "" && localStorage.getItem("name")) {
      setName(localStorage.getItem("name") || "");
    }
  }, []);
  return (
    <div className="flex items-center h-screen w-screen bg-black flex-row-reverse">
      <div className="flex w-3/4">
        {!!video ? (
          <video
            id="lider-video"
            className="w-screen h-screen object-cover"
          ></video>
        ) : (
          <div className="bg-black w-screen h-screen flex items-center justify-center ">
            <img
              src={avatar || defaultAvatar}
              alt="Avatar"
              className=" rounded-full w-[200px] h-[200px]"
            />
          </div>
        )}
      </div>
      <div className="w-1/4 text-left flex justify-center bg-[#181b29] h-full">
        <div className="flex flex-col space-y-6 items-center w-fit justify-center ">
          <p className="text-2xl text-white">What's your name</p>
          <input
            className="p-2 border rounded"
            placeholder="Your name"
            onChange={handleNameChange}
            value={name}
          />
          <div className="bg-white p-4 rounded">
            <Upload
              action="https://files-lider.it-pfiev-dut.tech/api/upload"
              accept="image/*"
              onChange={(info) => {
                const { status, response } = info.file;
                if (status === "done") {
                  message.success(
                    `${info.file.name} fi le uploaded successfully.`
                  );
                  handleFileUpload(info.file, response);
                } else if (status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <button className="text-black">
                <i className="ri-upload-2-line"></i> Upload avatar
              </button>
            </Upload>
          </div>

          <button
            className="bg-[#0e78f8] text-white p-2 rounded w-full"
            onClick={handleJoinMeeting}
          >
            Join meeting
          </button>
          <div className="space-x-4 w-fit">
            <button
              className={`rounded-full border border-[#262a39] text-2xl p-2 w-[55px] h-[55px] bg-[${
                video ? "#00000080" : "#EA4335"
              }]`}
              onClick={() => {
                toggleVideo();
              }}
            >
              <i
                className={`ri-camera${
                  video ? "-line" : "-off-line"
                } text-white w-5`}
              ></i>
            </button>
            <button
              className={`rounded-full border border-[#262a39] text-2xl p-2 w-[55px] h-[55px] bg-[${
                audio ? "#00000080" : "#EA4335"
              }]`}
              onClick={() => toggleAudio()}
            >
              <i
                className={`ri-mic${audio ? "-line" : "-off-line"} text-white`}
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
