"use client";

import { useEffect, useRef, useState } from "react";
import "../components/kaiwa/kaiwa.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, SECRET } from "../Config";
import axios from "axios";

const Kaiwa = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [callType, setCallType] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showExitScreen, setShowExitScreen] = useState(false);
  const [exitCountdown, setExitCountdown] = useState(0);
  const streamRef = useRef(null);

  // Debug: Log tất cả state changes
  useEffect(() => {
    console.log("🔍 DEBUG - State changes:", {
      joined,
      isRecording,
      isProcessing,
      hasAnalysisResult: !!analysisResult,
      analysisResultLength: analysisResult.length,
      showExitScreen,
    });
  }, [joined, isRecording, isProcessing, analysisResult, showExitScreen]);

  // Khởi tạo ghi âm
  const startRecording = async () => {
    try {
      console.log("🎙️ Bắt đầu khởi tạo ghi âm...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = []; // Reset chunks

      const options = {
        mimeType: "audio/webm;codecs=opus",
      };

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "audio/mp4";
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = "audio/wav";
        }
      }

      console.log("🎵 Sử dụng MIME type:", options.mimeType);

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(
            `📊 Thu thập chunk ${audioChunksRef.current.length}: ${event.data.size} bytes`
          );
        }
      };

      mediaRecorderRef.current.onstart = () => {
        setIsRecording(true);
        console.log("✅ Ghi âm đã bắt đầu");
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        console.log("⏹️ Ghi âm đã dừng, bắt đầu xử lý...");
        await processAudioData();
      };

      mediaRecorderRef.current.start(1000);
      console.log("🚀 MediaRecorder đã start");
    } catch (err) {
      console.error("❌ Lỗi khởi tạo ghi âm:", err);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập!");
    }
  };

  // Xử lý dữ liệu audio
  const processAudioData = async () => {
    console.log("🔄 Bắt đầu processAudioData...");
    console.log("📊 Số chunks:", audioChunksRef.current.length);

    if (audioChunksRef.current.length === 0) {
      console.log("⚠️ Không có dữ liệu audio để xử lý");
      setAnalysisResult(
        "Không có dữ liệu audio được ghi lại. Vui lòng thử lại."
      );
      return;
    }

    console.log(`📦 Xử lý ${audioChunksRef.current.length} chunks audio`);

    const mimeType =
      mediaRecorderRef.current?.mimeType || "audio/webm;codecs=opus";
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    console.log(`💾 Kích thước audio blob: ${audioBlob.size} bytes`);

    if (audioBlob.size === 0) {
      console.log("⚠️ Audio blob trống");
      setAnalysisResult("Audio blob rỗng. Vui lòng kiểm tra microphone.");
      return;
    }

    const formData = new FormData();
    const extension = mimeType.includes("webm")
      ? "webm"
      : mimeType.includes("mp4")
      ? "mp4"
      : "wav";
    formData.append("audio", audioBlob, `recording.${extension}`);

    console.log(`📤 Chuẩn bị gửi file: recording.${extension}`);

    setIsProcessing(true);

    try {
      console.log("🌐 Gửi request đến server...");
      const response = await axios.post(
        "http://localhost:2704/api/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      console.log("✅ Nhận response từ server:", response.data);
      console.log("📝 Summary content:", response.data.summary);

      if (response.data && response.data.summary) {
        setAnalysisResult(response.data.summary);
        console.log(
          "✅ Đã set analysisResult:",
          response.data.summary.substring(0, 100) + "..."
        );

        // Lưu vào localStorage để backup
        localStorage.setItem(
          "lastMeetingAnalysis",
          JSON.stringify({
            result: response.data.summary,
            timestamp: new Date().toISOString(),
          })
        );
        console.log("💾 Đã lưu vào localStorage");
      } else {
        console.log("⚠️ Response không có summary");
        setAnalysisResult("Server trả về dữ liệu không hợp lệ.");
      }
    } catch (error) {
      console.error("❌ Lỗi gửi audio:", error);

      let errorMessage = "Lỗi không xác định.";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Lỗi: Quá thời gian chờ. Vui lòng thử lại.";
      } else if (error.response?.data?.error?.includes("insufficient_quota")) {
        errorMessage =
          "Lỗi: Tài khoản OpenAI đã hết hạn mức. Vui lòng liên hệ quản trị viên.";
      } else if (error.response?.data?.error) {
        errorMessage = `Lỗi server: ${error.response.data.error}`;
      } else if (error.message) {
        errorMessage = `Lỗi kết nối: ${error.message}`;
      }

      setAnalysisResult(errorMessage);
      console.log("❌ Đã set error message:", errorMessage);
    } finally {
      setIsProcessing(false);
      console.log("🏁 processAudioData hoàn thành");
    }
  };

  // Dừng ghi âm
  const stopRecording = async () => {
    console.log("⏹️ Yêu cầu dừng ghi âm...");

    return new Promise((resolve) => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        console.log("⏹️ Đang dừng MediaRecorder...");

        mediaRecorderRef.current.onstop = async () => {
          console.log("✅ MediaRecorder đã dừng, bắt đầu xử lý...");
          await processAudioData();
          resolve();
        };

        mediaRecorderRef.current.stop();

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          console.log("🔌 Đã dừng media stream");
        }
      } else {
        console.log("⚠️ MediaRecorder không trong trạng thái recording");
        resolve();
      }
    });
  };

  // Handle exit với delay để xem kết quả
  const handleExit = async () => {
    console.log("🚪 Bắt đầu thoát phòng...");

    // Hiện màn hình exit
    setShowExitScreen(true);

    // Dừng ghi âm và xử lý
    console.log("⏹️ Dừng ghi âm trước khi thoát...");
    await stopRecording();

    // Destroy video call
    if (zpRef.current) {
      zpRef.current.destroy();
      console.log("📹 Đã destroy video call");
    }

    // Đợi một chút để đảm bảo analysis hoàn thành
    console.log("⏳ Đợi analysis hoàn thành...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Đếm ngược để user xem kết quả
    let countdown = 600; // Tăng lên 20 giây
    setExitCountdown(countdown);

    console.log("⏱️ Bắt đầu đếm ngược:", countdown);

    const countdownInterval = setInterval(() => {
      countdown--;
      setExitCountdown(countdown);
      console.log("⏱️ Countdown:", countdown);

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        console.log("🏠 Chuyển về trang chủ");
        navigate("/room");
      }
    }, 1000);
  };

  // Force exit ngay lập tức
  const forceExit = () => {
    console.log("🏃‍♂️ Force exit");
    navigate("/room");
  };

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      console.log("🧹 Component cleanup");
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const myMeeting = (type) => {
    const appID = APP_ID;
    const serverSecret = SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Your Name"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: videoContainerRef.current,
      sharedLinks: [
        {
          name: "Video Call Link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?type=" +
            encodeURIComponent(type),
        },
      ],
      scenario: {
        mode:
          type === "one-on-one"
            ? ZegoUIKitPrebuilt.OneONoneCall
            : ZegoUIKitPrebuilt.GroupCall,
      },
      maxUsers: type === "one-on-one" ? 2 : 10,
      onJoinRoom: () => {
        console.log("🎉 Đã join room");
        setJoined(true);
      },
      onLeaveRoom: () => {
        console.log("👋 Leave room triggered");
        handleExit(); // Sử dụng handleExit thay vì navigate trực tiếp
      },
    });
  };

  useEffect(() => {
    if (joined) {
      console.log("🎉 Joined room, starting recording...");
      startRecording();
    }
  }, [joined]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");
    console.log("🔗 Call type from URL:", type);
    setCallType(type);
  }, [location.search]);

  useEffect(() => {
    if (callType) {
      console.log("📞 Initializing meeting with type:", callType);
      myMeeting(callType);
    }
  }, [callType, roomId, navigate]);

  // Nếu đang hiện exit screen
  if (showExitScreen) {
    return (
      <div className="exit-screen">
        <div className="analysis-container">
          <div className="analysis-header">
            <div className="analysis-icon">📊</div>
            <h2 className="analysis-title">Phân tích cuộc họp</h2>
          </div>

          {isProcessing && (
            <div className="analysis-loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">
                Đang phân tích nội dung cuộc họp...
              </p>
            </div>
          )}

          {analysisResult && (
            <div className="analysis-result">
              <div className="result-header">
                <h3 className="result-title">Kết quả phân tích</h3>
                <div className="result-actions">
                  <button
                    className="action-button copy-button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(analysisResult)
                        .then(() => alert("Đã sao chép kết quả!"))
                        .catch((err) =>
                          console.error("Lỗi khi sao chép: ", err)
                        );
                    }}
                  >
                    <span className="button-icon">📋</span>
                    <span className="button-text">Sao chép</span>
                  </button>
                </div>
              </div>
              <div className="result-content">{analysisResult}</div>
            </div>
          )}

          {!isProcessing && !analysisResult && (
            <div className="error-message">
              ⚠️ Không có kết quả phân tích. Vui lòng thử lại.
            </div>
          )}

          <div className="exit-footer">
            {exitCountdown > 0 ? (
              <>
                <p className="countdown-info">
                  Tự động chuyển về trang chủ sau:{" "}
                  <strong>{exitCountdown}s</strong>
                </p>
                <button
                  onClick={forceExit}
                  className="action-button exit-button"
                >
                  <span className="button-icon">🚪</span>
                  <span className="button-text">Thoát ngay</span>
                </button>
              </>
            ) : (
              <p className="redirect-info">Đang chuyển hướng...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room-container">
      {!joined && (
        <>
          <header className="room-header">
            {callType === "one-on-one"
              ? "One-on-One Video Call"
              : "Group Video Call"}
          </header>
          <button className="exit-button" onClick={handleExit}>
            Exit
          </button>
        </>
      )}

      <div className="recording-status">
        {isRecording ? (
          <p style={{ color: "green", fontWeight: "bold" }}>
            🔴 Đang ghi âm cuộc họp...
          </p>
        ) : joined ? (
          <p style={{ color: "orange" }}>⏸️ Ghi âm tạm dừng</p>
        ) : (
          <p style={{ color: "red" }}>⚫ Chưa bắt đầu ghi âm</p>
        )}
      </div>

      <div ref={videoContainerRef} className="video-container" />
    </div>
  );
};

export default Kaiwa;
