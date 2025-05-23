import React from 'react';
import './styles.css';
const Kaiwa = () => (
    <div className="main__meeting" id="app" style={{ visibility: 'hidden' }}>
      <div className="main__left" id="main">
        <div className="main__videos">
          <div id="video-grid" className="cameras"></div>
        </div>
        <div className="main__controls">
          <div className="container-fluid">
            <div className="row">
              <div className="col col-cbar">
                <div className="row w-100">
                  <div className="col icon-row pointer" id="mute">
                    <i className="fas fa-microphone-slash fa-2x" id="muteIcon"></i>
                    <span>Stop Audio</span>
                  </div>
                  <div className="col icon-row pointer" id="video">
                    <i className="fas fa-video-slash fa-2x" id="videoIcon"></i>
                    <span>Stop Video</span>
                  </div>
                </div>
              </div>
              
              <div className="col col-cbar">
                <div className="row w-100">
                  <div className="col icon-row pointer">
                    <i className="fas fa-user-friends fa-2x"></i>
                    Participants
                  </div>
                  <div className="col icon-row pointer" id="hidechat">
                    <i className="fas fa-comment-alt fa-2x"></i>
                    Chat
                  </div>
                </div>
              </div>
  
              <div className="col col-cbar">
                <div className="row w-100">
                  <div className="col">
                    <button className="btn btn-danger exit-button h-100" id="leave">
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div className="main__right" id="chat">
        <div className="bg-light text-dark h-100">
          <div className="row h-80 m-0">
            <div className="message-box" id="messages"></div>
          </div>
          <div className="row h-20 m-0">
            <textarea className="chat-input" placeholder="Type message here"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default Kaiwa;