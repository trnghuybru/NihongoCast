"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../components/kaiwa/styles.css"
import "react-toastify/dist/ReactToastify.css"

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("")
  const [existingRoomId, setExistingRoomId] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleRoomIdGenerate = () => {
    const randomId = Math.random().toString(36).substring(2, 9)
    const timestamp = Date.now().toString().substring(-4)
    setRoomId(randomId + timestamp)
  }

  const handleOneAndOneCall = () => {
    if (!roomId) {
      alert("Please Generate Room Id First")
      return
    }
    navigate(`${roomId}?type=one-on-one`)
  }

  const handleGroupCall = () => {
    if (!roomId) {
      alert("Please Generate Room Id First")
      return
    }
    navigate(`${roomId}?type=group-call`)
  }

  const handleJoinRoom = () => {
    if (!existingRoomId) {
      alert("Please Enter a Room ID")
      return
    }
    navigate(`${existingRoomId}?type=group-call`)
  }

  return (
    <div className="kaiwa-container">

      <div className="kaiwa-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Connect with anyone, anywhere</h1>
          <p className="welcome-subtitle">
            Create or join a meeting with just a few clicks. High-quality video calls for one-on-one or group
            conversations.
          </p>
        </div>

        <div className="main-content main-container1">
          <div className="left-content">
            <div className="card create-card">
              <div className="card-header">
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </div>
                <h2 className="card-title">Create a new meeting</h2>
              </div>
              <div className="card-content">
                <div className="input-group">
                  <input
                    type="text"
                    className="room-input"
                    placeholder="Your room ID will appear here"
                    value={roomId}
                    readOnly
                  />
                  <button className="generate-btn" onClick={handleRoomIdGenerate}>
                    Generate ID
                  </button>
                </div>
                <div className="call-options">
                  <button className="call-btn one-on-one" onClick={handleOneAndOneCall} disabled={!roomId}>
                    <span className="btn-icon">👤</span>
                    <span className="btn-text">One-on-One</span>
                  </button>
                  <button className="call-btn group-call" onClick={handleGroupCall} disabled={!roomId}>
                    <span className="btn-icon">👥</span>
                    <span className="btn-text">Group Call</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="card join-card">
              <div className="card-header">
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <h2 className="card-title">Join existing meeting</h2>
              </div>
              <div className="card-content">
                <div className="input-group">
                  <input
                    type="text"
                    className="room-input"
                    placeholder="Enter room ID to join"
                    value={existingRoomId}
                    onChange={(e) => setExistingRoomId(e.target.value)}
                  />
                  <button className="join-btn" onClick={handleJoinRoom}>
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="right-content">
            {/* Original Time Display */}
            <div className="time-display">
              <div className="time-display-time">{formatTime(currentTime)}</div>
              <div className="time-display-date">{formatDate(currentTime)}</div>
            </div>

            <div className="stats-container">
              <div className="stat-box">
                <div className="stat-number">0</div>
                <div className="stat-label">Today's Meetings</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">0</div>
                <div className="stat-label">Upcoming</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default CreateRoom
