import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MeetingResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lấy kết quả từ state navigation hoặc localStorage
    const result = location.state?.analysisResult || localStorage.getItem('meetingAnalysis');
    
    if (result) {
      setAnalysisResult(result);
      // Xóa khỏi localStorage sau khi đã hiển thị
      localStorage.removeItem('meetingAnalysis');
    }
    
    setIsLoading(false);
  }, [location.state]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleNewMeeting = () => {
    navigate('/room');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div className="spinner" style={{
            border: "4px solid rgba(255,255,255,0.3)",
            borderTop: "4px solid white",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p>Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '20px'
        }}>
          <h1 style={{
            color: '#2c3e50',
            margin: '0 0 10px 0',
            fontSize: '2.5em'
          }}>
            📊 Kết quả phân tích cuộc họp
          </h1>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1em',
            margin: 0
          }}>
            {new Date().toLocaleString('vi-VN')}
          </p>
        </header>

        {analysisResult ? (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              whiteSpace: 'pre-line',
              lineHeight: '1.8',
              fontSize: '1.1em',
              color: '#2c3e50'
            }}>
              {analysisResult}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#7f8c8d'
          }}>
            <div style={{ fontSize: '4em', marginBottom: '20px' }}>📭</div>
            <h3>Không có kết quả phân tích</h3>
            <p>Cuộc họp có thể chưa được ghi âm hoặc xử lý.</p>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleNewMeeting}
            style={{
              padding: '15px 30px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1em',
              cursor: 'pointer',
              transition: 'all 0.3s',
              minWidth: '150px'
            }}
            onMouseOver={(e) => e.target.style.background = '#2980b9'}
            onMouseOut={(e) => e.target.style.background = '#3498db'}
          >
            🎥 Cuộc họp mới
          </button>
          
          <button
            onClick={handleBackToHome}
            style={{
              padding: '15px 30px',
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1em',
              cursor: 'pointer',
              transition: 'all 0.3s',
              minWidth: '150px'
            }}
            onMouseOver={(e) => e.target.style.background = '#7f8c8d'}
            onMouseOut={(e) => e.target.style.background = '#95a5a6'}
          >
            🏠 Về trang chủ
          </button>
          
          {analysisResult && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(analysisResult);
                alert('Đã copy kết quả vào clipboard!');
              }}
              style={{
                padding: '15px 30px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1em',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minWidth: '150px'
              }}
              onMouseOver={(e) => e.target.style.background = '#229954'}
              onMouseOut={(e) => e.target.style.background = '#27ae60'}
            >
              📋 Copy kết quả
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingResults;