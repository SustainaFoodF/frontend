import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const [tempAccount, setTempAccount] = useState("");
  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [imageError, setImageError] = useState(false);
  const [counter, setCounter] = useState(5);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState({});
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;

  const location = useLocation();
  const navigate = useNavigate();

  

  const loadModels = async () => {
    const uri = "/models";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };

  useEffect(() => {
    setTempAccount(location?.state?.account);
  }, []);

  useEffect(() => {
    if (tempAccount) {
      loadModels()
        .then(async () => {
          const labeledFaceDescriptors = await loadLabeledImages();
          setLabeledFaceDescriptors(labeledFaceDescriptors);
        })
        .then(() => setModelsLoaded(true));
    }
  }, [tempAccount]);

  useEffect(() => {
    if (loginResult === "SUCCESS") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);
  
      if (counter === 0) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        localUserStream.getTracks().forEach((track) => {
          track.stop();
        });
        clearInterval(counterInterval);
        clearInterval(faceApiIntervalRef.current);
        localStorage.setItem(
          "faceAuth",
          JSON.stringify({ status: true, account: tempAccount })
        );
  
        // Store user data in localStorage
        localStorage.setItem("isLoggedUser", true); // From previous request
        localStorage.setItem("token", tempAccount?.token || "your-token-here"); // Add token
        localStorage.setItem("userRole", tempAccount?.role);
        localStorage.setItem("loggedInUserId", tempAccount?._id);
        localStorage.setItem("userEmail", tempAccount?.email);
        localStorage.setItem("image", tempAccount?.image);
        localStorage.setItem("cart", JSON.stringify([]));
        localStorage.setItem("user", JSON.stringify(tempAccount));
  
        // Redirect based on user role
        const role = tempAccount?.role?.toLowerCase();
        switch (role) {
          case "client":
            navigate("/client-dashboard", { replace: true });
            break;
          case "business":
            navigate("/business-dashboard", { replace: true });
            break;
          case "livreur":
            navigate("/livreur-dashboard", { replace: true });
            break;
          default:
            navigate("/protected", { replace: true }); // Fallback if role is undefined or unrecognized
        }
      }
  
      return () => clearInterval(counterInterval);
    }
    setCounter(5);
  }, [loginResult, counter, tempAccount, localUserStream, navigate]);

  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const scanFace = async () => {
    faceapi.matchDimensions(canvasRef.current, videoRef.current);
    const faceApiInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoWidth,
        height: videoHeight,
      });

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const results = resizedDetections.map((d) => {
        if (faceMatcher.matchDescriptor(d.descriptor).distance < 0.2) {
          setImageError(true);
          return;
        }
        return faceMatcher.findBestMatch(d.descriptor);
      });

      if (!canvasRef.current) {
        return;
      }

      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

      if (results.length > 0 && tempAccount.name === results[0].label) {
        setLoginResult("SUCCESS");
      } else {
        setLoginResult("FAILED");
      }

      if (!faceApiLoaded) {
        setFaceApiLoaded(true);
      }
    }, 1000 / 15);
    faceApiIntervalRef.current = faceApiInterval;
  };

  async function loadLabeledImages() {
    if (!tempAccount) {
      return null;
    }
    const descriptions = [];

    let img;
    try {
      const imgPath = tempAccount.image;
      img = await faceapi.fetchImage(imgPath);
    } catch {
      setImageError(true);
      return;
    }

    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      descriptions.push(detections.descriptor);
    }

    return new faceapi.LabeledFaceDescriptors(tempAccount.name, descriptions);
  }

  if (imageError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          maxWidth: "840px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.875rem",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "#be123c",
          }}
        >
          <span style={{ display: "block" }}>
            Profile image doesn't match.
          </span>
        </h2>
        <span style={{ display: "block", marginTop: "1rem" }}>
          Please contact administration for registration or try again later.
        </span>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .content {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 24px;
            max-width: 720px;
            margin-left: auto;
            margin-right: auto;
          }
          .heading {
            text-align: center;
            font-family: 'Poppins', sans-serif;
            font-size: 2.25rem;
            letter-spacing: -0.025em;
            color: #1f2937;
          }
          .heading-sm {
            font-size: 1.875rem;
          }
          .subheading {
            display: block;
            margin-top: 0.5rem;
            color: #6366f1;
            font-weight: 600;
          }
          .success-heading {
            text-align: center;
            font-size: 1.25rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #1f2937;
          }
          .success-subheading {
            display: block;
            margin-top: 0.5rem;
            color: #6366f1;
          }
          .success-text {
            display: block;
            margin-top: 0.5rem;
          }
          .failed-heading {
            text-align: center;
            font-size: 2.25rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #be123c;
            margin-top: 3.5rem;
            display: block;
          }
          .failed-text {
            color: #991b1b;
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
          }
          .pending-heading {
            text-align: center;
            font-size: 2.25rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #1f2937;
            margin-top: 3.5rem;
            display: block;
          }
          .pending-subheading {
            color: #818cf8;
          }
          .video-container {
            width: 100%;
          }
          .video-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
          }
          .video {
            object-fit: fill;
            height: 360px;
            border-radius: 10px;
          }
          .canvas {
            position: absolute;
          }
          .loading-image {
            cursor: pointer;
            margin-top: 2rem;
            margin-bottom: 2rem;
            margin-left: auto;
            margin-right: auto;
            object-fit: cover;
            height: 272px;
          }
          .scan-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.625rem 1.25rem;
            margin-right: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #ffffff;
            background-color: #6366f1;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            cursor: pointer;
          }
          .scan-button:hover {
            background-color: #4f46e5;
          }
          .disabled-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.625rem 1.25rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #1f2937;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            cursor: not-allowed;
          }
          .disabled-button:hover {
            background-color: #f3f4f6;
            color: #1d4ed8;
          }
          .retry-button {
            display: flex;
            gap: 0.5rem;
            width: fit-content;
            margin-top: 1.25rem;
            margin-bottom: 1.25rem;
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            border-radius: 9999px;
            background: linear-gradient(to right, #f87171, #ef4444);
          }
          .retry-text {
            color: #ffffff;
          }
          .retry-icon {
            width: 1.5rem;
            height: 1.5rem;
            fill: none;
            stroke: #ffffff;
            stroke-width: 1.5;
          }
        `}
      </style>
      <div className="container">
        <div className="content">
          {!localUserStream && !modelsLoaded && (
            <h2 className="heading heading-sm">
              <span style={{ display: "block" }}>
                Processing your Login Request...
              </span>
              <span className="subheading">Loading Models...</span>
            </h2>
          )}
          {!localUserStream && modelsLoaded && (
            <h2 className="heading heading-sm">
              <span className="subheading">
                Please show your Face in the Camera
              </span>
            </h2>
          )}
          {localUserStream && loginResult === "SUCCESS" && (
            <h2 className="success-heading">
              <span className="success-subheading">
                We've successfully recognized your face!
              </span>
              <span className="success-text">
                Please stay {counter} more seconds...
              </span>
            </h2>
          )}
          {localUserStream && loginResult === "FAILED" && (
            <h2 className="failed-heading">
              Unable to Recognize your face !!
            </h2>
          )}
          {loginResult === "FAILED" && (
            <p className="failed-text">Unauthorized Access !!</p>
          )}
          {localUserStream && !faceApiLoaded && loginResult === "PENDING" && (
            <h2 className="pending-heading">
              <span className="pending-subheading">Scanning Face...</span>
            </h2>
          )}
          <div className="video-container">
            <div className="video-wrapper">
              <video
                muted
                autoPlay
                ref={videoRef}
                height={videoHeight}
                width={videoWidth}
                onPlay={scanFace}
                className={localUserStream ? "video video-active" : "video"}
                style={{ display: localUserStream ? "block" : "none" }}
              />
              <canvas
                ref={canvasRef}
                className={localUserStream ? "canvas canvas-active" : "canvas"}
                style={{ display: localUserStream ? "block" : "none" }}
              />
            </div>
            {!localUserStream && (
              <>
                {modelsLoaded ? (
                  <>
                    <img
                      alt="loading models"
                      src="./images/face.gif"
                      className="loading-image"
                    />
                    <button
                      onClick={getLocalUserVideo}
                      type="button"
                      className="scan-button"
                    >
                      Scan my face
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      alt="loading models"
                      src="./images/720.svg"
                      className="loading-image"
                    />
                    <button
                      disabled
                      type="button"
                      className="disabled-button"
                    >
                      Please wait while models were loading...
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          {loginResult === "FAILED" && (
            <div
              onClick={() => {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
                localUserStream.getTracks().forEach((track) => {
                  track.stop();
                });
                clearInterval(faceApiIntervalRef.current);
                localStorage.removeItem("faceAuth");
                navigate("/");
              }}
              className="retry-button"
            >
              <span className="retry-text">Retry</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="retry-icon"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;