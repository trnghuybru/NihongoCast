import React from 'react';
import './styles.css';
const CreateRoom = () => (
    <>
      <div className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="row w-100">
            <div className="col">
              <div className="row">
                <div className="col icon-row selected pointer">
                  <i className="fas fa-home"></i>
                  Home
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div className="main">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="row h-50">
                <div className="col icon-row">
                  <div className="icon-box orange" data-bs-toggle="modal" data-bs-target="#createMeetingModal">
                    <i className="fas fa-video fa-2x"></i>
                  </div>
                  <p>New Meeting</p>
                </div>
                <div className="col icon-row">
                  <div className="icon-box" data-bs-toggle="modal" data-bs-target="#meetingsModal">
                    <i className="fas fa-plus-square fa-2x"></i>
                  </div>
                  <p>Join</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-img-top meetings-card" alt="Card image cap">
                  <div>
                    <h1 id="time">0:00 AM</h1>
                    <p id="date">Saturday, November 20, 2021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Modals */}
      <div className="modal fade" id="createMeetingModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create meeting</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input className="form-control" type="text" id="newMeetingID" />
              <br />
              <p className="text-center">
                <button type="button" className="btn btn-primary" id="genNewMeetingID">
                  Create meeting
                </button>
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" id="copyMeetingID">
                Copy meeting ID
              </button>
              <button type="button" className="btn btn-primary" id="joinNewMeeting">
                Join meeting
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div className="modal fade" id="meetingsModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Join meeting</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <p>Please enter your meeting ID:</p>
              <input className="form-control" type="text" id="meetingID" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" id="join">
                Join meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  export default CreateRoom;