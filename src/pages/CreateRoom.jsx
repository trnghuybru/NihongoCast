"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { create_UUID, getCurrentTimeAndDate } from "../components/hooks/home"
import "../components/kaiwa/styles-modern.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const CreateRoom = () => {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [newMeetingId, setNewMeetingId] = useState("")
  const [joinMeetingId, setJoinMeetingId] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const navigate = useNavigate()
  const newMeetingIdRef = useRef(null)

  useEffect(() => {
    const updateTimeAndDate = () => {
      const { time: newTime, date: newDate } = getCurrentTimeAndDate()
      setTime(newTime)
      setDate(newDate)
    }

    updateTimeAndDate() // Initial call
    const interval = setInterval(updateTimeAndDate, 1000)
    return () => clearInterval(interval)
  }, [])

  // Xử lý body khi modal hiển thị
  useEffect(() => {
    if (showCreateModal || showJoinModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [showCreateModal, showJoinModal])

  const generateMeetingId = () => {
    const id = create_UUID()
    setNewMeetingId(id)
    toast.success("Meeting ID generated successfully!")
  }

  const copyMeetingId = () => {
    navigator.clipboard
      .writeText(newMeetingId)
      .then(() => {
        toast.success("Meeting ID copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast.error("Failed to copy to clipboard")
      })
  }

  const joinNewMeeting = () => {
    if (newMeetingId) {
      navigate(`/meeting/${newMeetingId}`)
    } else {
      toast.error("Please create a meeting first")
    }
  }

  const joinMeeting = () => {
    if (joinMeetingId) {
      navigate(`/meeting/${joinMeetingId}`)
    } else {
      toast.error("Please enter a valid meeting ID")
    }
  }

  const closeModal = (setter) => {
    setIsClosing(true)
    setTimeout(() => {
      setter(false)
      setIsClosing(false)
    }, 300)
  }

  return (
    <div className="app-container">
 
      <main className="app-main">
        <div className="container kaiwa-container">
          <div className="welcome-section">
            <h1>Welcome to Kaiwa</h1>
            <p>Create or join a meeting with just a few clicks</p>
          </div>

          <div className="content-grid">
            {/* Left Side: Action Buttons */}
            <div className="action-buttons">
              <div className="action-card new-meeting" onClick={() => setShowCreateModal(true)}>
                <div className="action-icon">
                  <i className="fas fa-video"></i>
                </div>
                <div className="action-text">
                  <h3>New Meeting</h3>
                  <p>Create a new meeting and invite others</p>
                </div>
              </div>

              <div className="action-card join-meeting" onClick={() => setShowJoinModal(true)}>
                <div className="action-icon">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <div className="action-text">
                  <h3>Join Meeting</h3>
                  <p>Join an existing meeting with a code</p>
                </div>
              </div>
            </div>

            {/* Right Side: Time Card */}
            <div className="time-card">
              <div className="time-display">
                <div className="time">{time}</div>
                <div className="date">{date}</div>
              </div>
              <div className="quick-stats">
                <div className="stat">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Today's Meetings</div>
                </div>
                <div className="stat">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className={`modal-container ${isClosing ? "closing" : ""}`}>
          <div className="modal-backdrop" onClick={() => closeModal(setShowCreateModal)}></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-video"></i> Create New Meeting
                </h5>
                <button className="close-button" onClick={() => closeModal(setShowCreateModal)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="meetingId">Meeting ID</label>
                  <div className="input-group">
                    <input
                      id="meetingId"
                      className="form-input"
                      type="text"
                      placeholder="Your meeting ID will appear here"
                      value={newMeetingId}
                      onChange={(e) => setNewMeetingId(e.target.value)}
                      ref={newMeetingIdRef}
                      readOnly={!!newMeetingId}
                    />
                    {newMeetingId && (
                      <button className="input-group-btn" onClick={copyMeetingId} title="Copy to clipboard">
                        <i className="fas fa-copy"></i>
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Meeting Options</label>
                  <div className="option-toggles">
                    <div className="toggle-option">
                      <input type="checkbox" id="video" defaultChecked />
                      <label htmlFor="video">Start with video</label>
                    </div>
                    <div className="toggle-option">
                      <input type="checkbox" id="audio" defaultChecked />
                      <label htmlFor="audio">Start with audio</label>
                    </div>
                  </div>
                </div>

                <div className="generate-button-container">
                  <button className="btn btn-generate" onClick={generateMeetingId}>
                    <i className="fas fa-random"></i> Generate Meeting ID
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => closeModal(setShowCreateModal)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={joinNewMeeting} disabled={!newMeetingId}>
                  <i className="fas fa-sign-in-alt"></i> Start Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Meeting Modal */}
      {showJoinModal && (
        <div className={`modal-container ${isClosing ? "closing" : ""}`}>
          <div className="modal-backdrop" onClick={() => closeModal(setShowJoinModal)}></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-sign-in-alt"></i> Join Meeting
                </h5>
                <button className="close-button" onClick={() => closeModal(setShowJoinModal)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="joinMeetingId">Meeting ID</label>
                  <input
                    id="joinMeetingId"
                    className="form-input"
                    type="text"
                    placeholder="Enter meeting ID"
                    value={joinMeetingId}
                    onChange={(e) => setJoinMeetingId(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="displayName">Your Name (optional)</label>
                  <input id="displayName" className="form-input" type="text" placeholder="Enter your name" />
                </div>

                <div className="form-group">
                  <label>Meeting Options</label>
                  <div className="option-toggles">
                    <div className="toggle-option">
                      <input type="checkbox" id="joinVideo" defaultChecked />
                      <label htmlFor="joinVideo">Join with video</label>
                    </div>
                    <div className="toggle-option">
                      <input type="checkbox" id="joinAudio" defaultChecked />
                      <label htmlFor="joinAudio">Join with audio</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => closeModal(setShowJoinModal)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={joinMeeting} disabled={!joinMeetingId}>
                  <i className="fas fa-sign-in-alt"></i> Join Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default CreateRoom
