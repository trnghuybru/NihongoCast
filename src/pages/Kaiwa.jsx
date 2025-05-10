"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { io } from 'socket.io-client'
import Peer from 'peerjs'
import Swal from "sweetalert2"
import { getCurrentTimeAndDate } from "../components/hooks/home.js"
import Message from "../components/hooks/objects/Message.js"
import User from "../components/hooks/objects/User.js"
import "../components/kaiwa/kaiwa.css"

const Kaiwa = () => {
  // State variables
  const [myStream, setMyStream] = useState(null)
  const [peers, setPeers] = useState({})
  const [messages, setMessages] = useState([])
  const [chatHidden, setChatHidden] = useState(false)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [username, setUsername] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [user, setUser] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)

  // Refs
  const videoGridRef = useRef(null)
  const myVideoRef = useRef(null)
  const socketRef = useRef(null)
  const peerRef = useRef(null)
  const chatInputRef = useRef(null)
  const meetingID = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : ""
  const [hasUsername, setHasUsername] = useState(false);
  // Update time every second
  useEffect(() => {
    const updateTimeAndDate = () => {
      const { time, date } = getCurrentTimeAndDate()
      setCurrentTime(time)
      setCurrentDate(date)
    }

    updateTimeAndDate() // Initial call
    const interval = setInterval(updateTimeAndDate, 1000)
    return () => clearInterval(interval)
  }, [])
  const create_UUID = () => {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return c === 'x' ? r.toString(16) : ((r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };
  useEffect(() => {
    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);
  // Sử dụng hàm create_UUID
  const newMeetingID = create_UUID();
  console.log("Generated Meeting ID:", newMeetingID);
  // Check if string is a valid UUID
  const isUUID = useCallback((uuid) => {
    const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return pattern.test(uuid);
  }, []);

  // URL Validation
  const isValidHttpUrl = useCallback((str) => {
    try {
      new URL(str)
      return str.startsWith("http")
    } catch {
      return false
    }
  }, [])

  // Media Constraints
  const mediaConstraints = {
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 }
    }
  }

  // Initialize media stream
  const initStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      console.log("Initializing media stream...")

      console.log("Media stream initialized:", stream)
      
      setMyStream(stream)
      
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream
        myVideoRef.current.muted = true
        await myVideoRef.current.play().catch(err => console.error("Error playing video:", err))
      }

      if (peerRef.current) {
        peerRef.current.on("call", call => {
          console.log("Incoming call from:", call.peer)
          call.answer(stream)
          const video = document.createElement("video")
          call.on("stream", userStream => {
            addVideoStream(video, userStream, call.peer)
          })
        })
      }

      setIsConnected(true)
    } catch (error) {
      console.error("Error accessing media devices:", error);
      Swal.fire({
        icon: "error",
        title: "Permission Required",
        text: "Please allow camera and microphone access",
      })
    }
  }, [])

  // Video Grid Management
  const updateVideoGrid = useCallback(() => {
    if (!videoGridRef.current) return

    const videos = videoGridRef.current.children
    const count = videos.length

    // Remove existing grid classes
    videoGridRef.current.className = "cameras"

    // Add appropriate grid class based on the number of videos
    if (count === 1) {
      videoGridRef.current.classList.add("grid-1")
    } else if (count === 2) {
      videoGridRef.current.classList.add("grid-2")
    } else if (count <= 4) {
      videoGridRef.current.classList.add("grid-3")
    } else if (count <= 6) {
      videoGridRef.current.classList.add("grid-5")
    } else {
      videoGridRef.current.classList.add("grid-7")
    }
    
    setParticipantCount(count)
  }, [])
  useEffect(() => {
    return () => {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      Object.values(peers).forEach(peer => peer.close());
    };
  }, [myStream, peers]);
  // Add video stream to grid
  const addVideoStream = useCallback((video, stream, userID) => {
    if (!video || !stream || document.getElementById(userID)) return

    console.log("Adding video stream for:", userID)
    video.srcObject = stream
    video.autoplay = true
    video.id = userID

    video.addEventListener("loadedmetadata", () => {
      video.play().catch(error => 
        console.error("Video play failed:", error)
      )
    })

    if (videoGridRef.current) {
      videoGridRef.current.appendChild(video)
      updateVideoGrid()
    }
  }, [updateVideoGrid])

  // Remove video stream from grid
  const removeVideoStream = useCallback((userID) => {
    console.log("Removing video stream for:", userID)
    const video = document.getElementById(userID)
    if (video && videoGridRef.current) {
      videoGridRef.current.removeChild(video)
      updateVideoGrid()
    }
    
    setPeers(prev => {
      const { [userID]: _, ...rest } = prev
      return rest
    })
  }, [updateVideoGrid])
  useEffect(() => {
    if (!isUUID(meetingID)) {
      alert("Invalid Meeting ID");
      window.location.href = "/";
    }
  }, [meetingID, isUUID]);
  // Connect to a new user
  const connectToNewUser = useCallback((userId, stream) => {
    if (!peerRef.current || !stream) {
      console.error("Cannot connect to user, peer or stream not available")
      return
    }

    console.log("Connecting to new user:", userId)
    const call = peerRef.current.call(userId, stream)
    const video = document.createElement("video")

    call.on("stream", userStream => {
      console.log("Received stream from user:", userId)
      addVideoStream(video, userStream, userId)
    })
    
    call.on("close", () => {
      console.log("Call closed for user:", userId)
      removeVideoStream(userId)
    })
    
    call.on("error", error => {
      console.error("Call error:", error)
    })

    setPeers(prev => ({ ...prev, [userId]: call }))
  }, [addVideoStream, removeVideoStream])

  // Handle userOK response
  const handleUserOK = useCallback(() => {
    console.log("User OK received, initializing stream...")
    if (isJoining && user && socketRef.current) {
      socketRef.current.emit("newUser", JSON.stringify(user))
      initStream()
      setIsJoining(false)
    } else {
      console.error("User is null when userOK received or not in joining state")
    }
  }, [user, isJoining, initStream])

  // Create user prompt
  const createUser = useCallback((exists) => {
    if (hasUsername) return;
  
    Swal.fire({
      title: exists ? "Username exists" : "Enter username",
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Join',
      preConfirm: (username) => {
        if (!username) {
          Swal.showValidationMessage('Username is required');
        }
        return username;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setHasUsername(true);
        setUsername(result.value);
        const newUser = new User(result.value, meetingID, peerRef.current.id);
        setUser(newUser);
        socketRef.current.emit('checkUser', JSON.stringify(newUser));
      }
    });
  }, [hasUsername, meetingID]);
  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        console.log("Peer connection destroyed");
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
        console.log("Media tracks stopped");
      }
    };
  }, [myStream]);
  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (typeof window === "undefined") return null
    
    try {
      console.log("Initializing socket connection...")
      // Connect to socket
      socketRef.current = io("http://localhost:3000", {
        path: "/socket.io",
        transports: ["websocket"]
      });
      
      // Set connection status
      socketRef.current.on("connect", () => {
        console.log("Socket connected")
        setIsConnected(true)
      })

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected")
        setIsConnected(false)
      })

      // Handle messages
      socketRef.current.on("message", (msg) => {
        if (msg === "userExists") {
          console.warn("Username đã có, mời nhập lại")
          setIsJoining(false)    // cho phép prompt lại
          createUser(true)       // gọi lại, nhưng vì hasUsername=false mới show
        }
        else if (msg === "userOK") {
          handleUserOK()
        } else {
          try {
            const input = JSON.parse(msg)
            if (input.user !== username && input.meetingID === meetingID) {
              const recv = new Message(input.user, input.content, input.meetingID)
              setMessages((prev) => [...prev, recv])
            }
          } catch (e) {
            console.error("Error parsing message:", e)
          }
        }
      })

      // Handle direct userOK event
      socketRef.current.on("userOK", () => {
        console.log("Direct userOK event received")
        handleUserOK()
      })

      // Handle user disconnection
      socketRef.current.on("userDisconnected", (msg) => {
        try {
          const data = JSON.parse(msg)
          removeVideoStream(data.userID)
        } catch (e) {
          console.error("Error parsing user disconnection:", e)
        }
      })

      // Handle new user
      socketRef.current.on("newUser", (msg) => {
        try {
          const input = JSON.parse(msg)
          console.log("New user event received:", input)
          if (input.meetingID === meetingID && input.userID !== peerRef.current?.id) {
            setTimeout(() => {
              if (myStream) {
                connectToNewUser(input.userID, myStream)
              } else {
                console.error("Cannot connect to new user, myStream is null")
              }
            }, 2000)
          }
        } catch (e) {
          console.error("Error parsing new user:", e)
        }
      })

      return socketRef.current
    } catch (error) {
      console.error("Error initializing socket:", error)
      return null
    }
  }, [meetingID, username, myStream, handleUserOK, createUser, connectToNewUser, removeVideoStream])

  // Initialize peer connection
  const initializePeer = useCallback(() => {
    try {
      console.log("Initializing peer connection...")
      
      if (typeof window === "undefined" || !window.Peer) {
        console.error("Peer.js not loaded")
        return
      }
      
      peerRef.current = new Peer(undefined, { // Bỏ id tự động
        host: 'localhost',
        port: 9000,
        path: '/peerjs',
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // Thêm TURN server nếu cần
          ]
        }
      });
      peerRef.current.on('error', (err) => {
        console.error('PeerJS Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Failed to initialize peer connection. Please refresh the page.',
        });
      });
      peerRef.current.on("open", (id) => {
        console.log("Peer ID:", id);
        if (!hasUsername) {
          createUser(false);
        }
      });

      peerRef.current.on("error", (err) => {
        console.error("Peer connection error:", err);
        Swal.fire("Connection Error", "Cannot establish peer connection", "error");
      });
    } catch (error) {
      console.error("Error creating Peer instance:", error)
    }
  }, [meetingID, isUUID, createUser])

  // Initialize everything on component mount
  useEffect(() => {
    if (typeof window === "undefined") return
    
    console.log("Component mounted, initializing...")
    
    // Load required libraries dynamically if not available
    const loadLibraries = async () => {
      // Check if Socket.IO is loaded
      if (!window.io) {
        console.log("Loading Socket.IO...")
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.socket.io/4.6.0/socket.io.min.js'
          script.integrity = 'sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+'
          script.crossOrigin = 'anonymous'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        }).catch(err => {
          console.error("Failed to load Socket.IO:", err)
          Swal.fire({
            icon: "error",
            title: "Connection Error",
            text: "Could not load required libraries. Please refresh the page or try again later.",
          })
        })
      }
      
      // Check if PeerJS is loaded
      if (!window.Peer) {
        console.log("Loading PeerJS...")
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js'
          script.crossOrigin = 'anonymous'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        }).catch(err => {
          console.error("Failed to load PeerJS:", err)
          Swal.fire({
            icon: "error",
            title: "Connection Error",
            text: "Could not load required libraries. Please refresh the page or try again later.",
          })
        })
      }
      
      console.log("Libraries loaded, initializing components...")
      initializePeer()
      initializeSocket()
    }
    
    loadLibraries()
    
    // Cleanup on component unmount
    return () => {
      setHasUsername(false);
      console.log("Component unmounting, cleaning up...")
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop())
      }
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (peerRef.current) {
        peerRef.current.destroy()
      }
    }
  }, [initializePeer, initializeSocket])

  // Toggle audio mute
  const toggleMute = useCallback(() => {
    if (!myStream) return

    const audioTracks = myStream.getAudioTracks()
    if (audioTracks.length === 0) return
    
    const enabled = audioTracks[0].enabled
    audioTracks[0].enabled = !enabled
    setMuted(!enabled)
    console.log("Audio muted:", !enabled)
  }, [myStream])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (!myStream) return

    const videoTracks = myStream.getVideoTracks()
    if (videoTracks.length === 0) return
    
    const enabled = videoTracks[0].enabled
    videoTracks[0].enabled = !enabled
    setVideoOff(!enabled)
    console.log("Video disabled:", !enabled)
  }, [myStream])

  // Handle leaving the meeting
  const handleLeave = useCallback(() => {
    Swal.fire({
      title: "Leave Meeting?",
      text: "Are you sure you want to leave this meeting?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, leave",
      cancelButtonText: "No, stay"
    }).then((result) => {
      if (result.isConfirmed) {
        if (user && socketRef.current) {
          setHasUsername(false);
          setUser(null);
          socketRef.current.emit("userDisconnected", JSON.stringify(user))
        }

        // Stop all tracks
        if (myStream) {
          myStream.getTracks().forEach(track => track.stop())
        }
        
        // Close all peer connections
        Object.values(peers).forEach(call => call.close())

        Swal.fire({
          title: "Leaving meeting",
          text: "This might take a while...",
          icon: "info",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/"
          }
        })
      }
    })
  }, [user, myStream, peers])

  // Send chat message
  const sendMessage = useCallback((e) => {
    if (e.key === "Enter" && chatInputRef.current) {
      const messageText = chatInputRef.current.value.trim()
      if (!messageText) return

      let m
      if (isValidHttpUrl(messageText)) {
        const msg = `<a href="${messageText}" target="_blank">${messageText}</a>`
        m = new Message(username, msg, meetingID)
      } else {
        m = new Message(username, messageText, meetingID)
      }

      setMessages((prev) => [...prev, m])
      chatInputRef.current.value = ""
      
      if (socketRef.current) {
        socketRef.current.emit("message", JSON.stringify(m))
      }
    }
  }, [username, meetingID, isValidHttpUrl])

  return (
    <div className="kaiwa-container">
      <div className="kaiwa-wrapper bg-dark text-light d-flex flex-column">
        {/* Meeting Info Header */}
        <div className="meeting-info-header">
          <div className="meeting-id">
            <span>Meeting ID: </span>
            <span className="id-value">{meetingID}</span>
          </div>
          <div className="meeting-time">
            <span className="time">{currentTime}</span>
            <span className="date">{currentDate}</span>
          </div>
        </div>

        <div className="meeting-content d-flex flex-grow-1">
          <div className={`video-container ${chatHidden ? "col-12" : "col-9"}`}>
            {/* Connection Status */}
            <div className="connection-status">
              <div className={`status-indicator ${isConnected ? "" : "bad"}`}></div>
              {isConnected ? "Connected" : "Disconnected"}
              {participantCount > 0 && (
                <span className="ms-2">
                  <i className="fas fa-users"></i> {participantCount}
                </span>
              )}
            </div>
            
            <div ref={videoGridRef} className="cameras grid-1"></div>

            <div className="controls bg-dark p-2 fixed-bottom">
              <div className="container-fluid">
                <div className="row justify-content-center">
                  <ControlButton
                    icon={muted ? "fa-microphone-slash" : "fa-microphone"}
                    text={muted ? "Unmute" : "Mute"}
                    onClick={toggleMute}
                    id="mute"
                    iconId="muteIcon"
                    active={muted}
                  />
                  <ControlButton
                    icon={videoOff ? "fa-video-slash" : "fa-video"}
                    text={videoOff ? "Start Video" : "Stop Video"}
                    onClick={toggleVideo}
                    id="video"
                    iconId="videoIcon"
                    active={videoOff}
                  />
                  <ControlButton
                    icon="fa-comment-alt"
                    text={chatHidden ? "Show Chat" : "Hide Chat"}
                    onClick={() => setChatHidden(!chatHidden)}
                    id="hidechat"
                  />
                  <button className="btn btn-danger" onClick={handleLeave} id="leave">
                    <i className="fas fa-phone-slash fa-lg"></i>
                    <span className="ms-2">Leave</span>
                  </button>
                </div>
              </div>
            </div>

            <video
              ref={myVideoRef}
              muted
              autoPlay
              playsInline
              className="position-fixed bottom-0 end-0 m-3"
              style={{ width: "200px", height: "150px", borderRadius: "8px" }}
            />
          </div>

          {!chatHidden && (
            <div id="chat" className="chat-panel col-3 bg-light text-dark p-3 d-flex flex-column">
              <div className="chat-header mb-3">
                <h4>Chat</h4>
              </div>
              <div id="messages" className="flex-grow-1 overflow-auto mb-3">
                {messages.length > 0 ? (
                  messages.map((msg, i) => (
                    <div key={i} className="message-item mb-3">
                      <div className="message-sender">
                        <strong>From {msg.user}</strong>
                      </div>
                      <div 
                        className="chat-message"
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted">
                    <i className="fas fa-comments fa-2x mb-2"></i>
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
              <textarea
                ref={chatInputRef}
                className="form-control chat-input"
                placeholder="Type message here and press Enter"
                onKeyPress={sendMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ControlButton = ({ icon, text, onClick, id, iconId, active }) => (
  <button 
    id={id} 
    className={`btn btn-dark mx-2 ${active ? 'active' : ''}`} 
    onClick={onClick}
  >
    <i id={iconId} className={`fas ${icon} fa-lg`}></i>
    <span className="ms-2">{text}</span>
  </button>
)

export default Kaiwa
