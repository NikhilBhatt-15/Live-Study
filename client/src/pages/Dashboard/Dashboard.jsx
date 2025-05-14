import { useEffect, useState } from "react";
import { Video, Play, Upload, Tags, Copy } from "lucide-react";
import { golive } from "../../api/auth.js";

import axios from "axios";
import { getChannelProfile, uploadVideo } from "../../api/auth.js";
import { formatDate, formatDuration } from "../../utils/utility.js"; // Import your date formatting function
function Dashboard() {
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [showStreamInfoModal, setShowStreamInfoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  // Live stream state
  const [isLive, setIsLive] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);
  const [streamKey, setStreamKey] = useState("");
  const [rtmpUrl, setRtmpUrl] = useState("");
  const [liveStreamData, setLiveStreamData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [channelInfo, setChannelInfo] = useState({});
  const [channelVideos, setChannelVideos] = useState([]);
  useEffect(() => {
    const fetchliveStream = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/live/get`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          const data = response.data.data;
          setLiveStreamData(data);
          setIsLive(true);
          setStreamStarted(data.isLive);
          setStreamKey(data.streamKey);
          setRtmpUrl(data.rtmpUrl);
          console.log("Stream key h ya nahi " + liveStreamData.streamKey);
        } else {
          alert("Failed to fetch stream status");
        }
      } catch (error) {
        console.error("Error fetching stream status:", error);
      }
    };
    const fetchChannelProfile = async () => {
      try {
        const response = await getChannelProfile();
        if (response.status === 200) {
          const data = response.data.data;
          setChannelInfo(data);
          setChannelVideos(data.videos);
        } else {
          alert("Failed to fetch channel profile");
        }
      } catch (error) {
        console.error("Error fetching channel profile:", error);
      }
    };
    fetchChannelProfile();
    fetchliveStream();
  }, []);

  // Copy feedback
  const [copied, setCopied] = useState({ key: false, url: false });

  // Tab state
  const [activeTab, setActiveTab] = useState("content");

  // Handle form input
  function handleInputChange(e) {
    const { name, value } = e.target;
    setLiveStreamData((prev) => ({ ...prev, [name]: value }));
  }

  // Start live stream (calls backend)
  async function handleGoLive() {
    const { title, description, tags } = liveStreamData;
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    setShowGoLiveModal(false);
    try {
      const response = await golive({ title, description, tags });
      if (response.status === 200) {
        setStreamKey(response.data.data.streamKey);
        setRtmpUrl(response.data.data.rtmpUrl);
        setLiveStreamData({
          title: response.data.data.title,
          description: response.data.data.description,
          tags: response.data.data.tags,
        });
        setShowStreamInfoModal(true);
      } else {
        alert("Failed to start live stream: " + response.data.message);
        setShowGoLiveModal(true);
      }
    } catch (error) {
      alert("Failed to start live stream");
      setShowGoLiveModal(true);
    }
  }

  // Copy to clipboard utility
  function handleCopy(text, field) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((prev) => ({ ...prev, [field]: true }));
      setTimeout(
        () => setCopied((prev) => ({ ...prev, [field]: false })),
        1200
      );
    });
  }

  // End the live stream
  function handleEndLive() {
    setIsLive(false);
    setStreamStarted(false);
    setStreamKey("");
    setRtmpUrl("");
    setLiveStreamData({ title: "", description: "", tags: "" });
    alert("Live stream ended.");
  }

  async function checkStreamStatus() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/live/status`,
        {
          streamKey: streamKey,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const data = response.data.data;
        setLiveStreamData({
          title: data.title,
          description: data.description,
          tags: data.tags,
        });
        setIsLive(data.isLive);
        setStreamStarted(data.isLive);
      } else {
        alert("Failed to fetch stream status");
      }
    } catch (error) {
      console.error("Error fetching stream status:", error);
    }
  }
  // After showing stream info modal, go live
  function handleContinueToLive() {
    setIsLive(true);
    setShowStreamInfoModal(false);

    // Start checking stream status every 10 seconds
    const intervalId = setInterval(async () => {
      console.log("Stream key h ya nahi " + liveStreamData);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/live/status`,
          {
            streamKey: streamKey,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          const data = response.data.data;
          setLiveStreamData(data);
          setStreamStarted(data.isLive);

          // Stop checking if the stream has started
          if (data.isLive) {
            clearInterval(intervalId);
          }
        } else {
          console.error("Failed to fetch stream status");
        }
      } catch (error) {
        console.error("Error fetching stream status:", error);
        clearInterval(intervalId); // Stop checking if there's an error
      }
    }, 10000); // Check every 10 seconds
  }

  async function handleUploadVideo() {
    if (
      !uploadForm.title.trim() ||
      !uploadForm.description.trim() ||
      !uploadForm.file
    ) {
      alert("Please fill in all fields.");
      return;
    }
    setUploading(true);

    try {
      const response = await uploadVideo({
        title: uploadForm.title,
        description: uploadForm.description,
        video: uploadForm.file,
      });
      if (response.status === 200) {
        alert("Video uploaded successfully");
        setShowUploadModal(false);
        setUploadForm({ title: "", description: "", file: null });
      } else {
        alert("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="dashboard-root">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Creator Dashboard</h1>
        <div className="dashboard-header-actions">
          {isLive ? (
            <button className="button button-danger" onClick={handleEndLive}>
              <Video size={20} className="icon mr-2" />
              End Stream
            </button>
          ) : (
            <button
              className="button button-outline"
              onClick={() => setShowGoLiveModal(true)}
            >
              <Play size={20} className="icon mr-2" />
              Go Live
            </button>
          )}
          <button
            className="button button-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={20} className="icon mr-2" />
            Upload Video
          </button>
        </div>
      </div>
      {/* Live Stream Section */}
      {isLive && (
        <div className="card card-live">
          <div className="card-header">
            <div>
              <span className="live-badge">LIVE</span>
              <span className="font-bold ml-2">
                Currently Live: {liveStreamData.title}
              </span>
            </div>
            <button
              className="button button-danger button-sm"
              onClick={handleEndLive}
            >
              End Stream
            </button>
          </div>
          <div className="card-content">
            <div className="video-preview">
              {streamStarted ? (
                <iframe
                  src={`https://www.livereacting.com/tools/hls-player-embed?url=http%3A%2F%2Flocalhost%3A8080%2Fhls%2F${liveStreamData.streamKey}%2Findex.m3u8`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    maxWidth: "100%",
                  }}
                ></iframe>
              ) : (
                <div className="flex-col-center">
                  <Video size={48} className="icon-lg mb-4 opacity-50" />
                  <p className="text-lg font-medium">Stream Not Started</p>
                  <p className="text-sm opacity-70 mt-2">
                    Connect your streaming software to begin
                  </p>
                </div>
              )}
            </div>
            <div className="flex-between">
              <div>
                <p className="text-sm text-gray">
                  {liveStreamData.description}
                </p>
                {/* {liveStreamData.tags && (
                  <div className="tags-list mt-2">
                    {liveStreamData.tags.split(",").map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )} */}
              </div>
              <div className="text-sm">
                <span className="text-red font-semibold">● LIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Views"
          value="42.5K"
          desc="+12% from last month"
        />
        <StatCard
          label="Subscribers"
          value={channelInfo.subscribersCount}
          desc={`+${channelInfo.subscribersCount} Subscribers this week`}
        />
        <StatCard label="Watch Hours" value="958" desc="Average 4.2 min/view" />
      </div>
      {/* Tabs */}
      <div className="tabs-root">
        <div className="tabs-list">
          {["content", "analytics", "comments", "monetization"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab tab-active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="tabs-content">
          {activeTab === "content" && (
            <>
              <div className="card mb-6">
                <div className="card-header">
                  <span className="font-semibold">Your Videos</span>
                </div>
                <div className="card-content">
                  {channelVideos.map((video) => (
                    <div key={video._id} className="video-item">
                      <div className="video-thumb">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="video-thumb-img"
                        />
                        {!video.isLive && (
                          <div className="video-duration">
                            {formatDuration(video.duration)}
                          </div>
                        )}
                      </div>
                      <div className="video-info">
                        <h3 className="video-title">{video.title}</h3>
                        <p className="video-meta">
                          {video.views} views • {formatDate(video.createdAt)}
                        </p>
                        {/* <div className="video-actions">
                          <button className="button button-outline button-sm">
                            Edit
                          </button>
                          <button className="button button-outline button-sm">
                            Analytics
                          </button>
                        </div> */}
                      </div>
                    </div>
                  ))}
                  {/* <button className="button button-outline w-full mt-4">
                    View All Videos
                  </button> */}
                </div>
              </div>
            </>
          )}
          {/* ...Other tabs can be filled in as needed... */}
        </div>
      </div>
      {/* Go Live Modal */}
      {showGoLiveModal && (
        <Modal onClose={() => setShowGoLiveModal(false)}>
          <div className="modal-content">
            <h2 className="modal-title">Start Live Stream</h2>
            <p className="modal-desc">
              Fill in the details below to start your live stream.
            </p>
            <div className="form-group">
              <label>Title</label>
              <input
                className="input"
                name="title"
                value={liveStreamData.title}
                onChange={handleInputChange}
                placeholder="Enter stream title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="input"
                name="description"
                value={liveStreamData.description}
                onChange={handleInputChange}
                placeholder="Describe your live stream"
              />
            </div>
            <div className="form-group">
              <label>
                <Tags size={18} className="icon mr-1" /> Tags
              </label>
              <input
                className="input"
                name="tags"
                value={liveStreamData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
              />
              <div className="form-hint">
                Separate tags with commas (e.g. coding, tutorial, react)
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="button button-outline"
                onClick={() => setShowGoLiveModal(false)}
              >
                Cancel
              </button>
              <button className="button button-primary" onClick={handleGoLive}>
                Start Stream
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Stream Info Modal */}
      {showStreamInfoModal && (
        <Modal onClose={() => setShowStreamInfoModal(false)}>
          <div className="modal-content">
            <h2 className="modal-title">Stream Connection Info</h2>
            <p className="modal-desc">
              Use these details to connect your streaming software (like OBS).
            </p>
            <div className="form-group">
              <label>RTMP URL</label>
              <div className="flex-row">
                <input className="input input-mono" value={rtmpUrl} readOnly />
                <button
                  className="button button-outline button-icon ml-2"
                  onClick={() => handleCopy(rtmpUrl, "url")}
                >
                  {copied.url ? "Copied!" : <Copy className="icon" size={20} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>
                Stream Key{" "}
                <span className="text-xs text-red ml-1">
                  (Sensitive - Don't share)
                </span>
              </label>
              <div className="flex-row">
                <input
                  className="input input-mono"
                  type="password"
                  value={streamKey}
                  readOnly
                />
                <button
                  className="button button-outline button-icon ml-2"
                  onClick={() => handleCopy(streamKey, "key")}
                >
                  {copied.key ? "Copied!" : <Copy className="icon" size={20} />}
                </button>
              </div>
              <div className="form-hint">
                Do not share your stream key with anyone. It gives others the
                ability to stream on your channel.
              </div>
            </div>
            <div className="modal-guide">
              <h4 className="modal-guide-title">Quick Setup Guide:</h4>
              <ol className="modal-guide-list">
                <li>Open OBS Studio or your preferred streaming software</li>
                <li>Go to Settings → Stream</li>
                <li>Select "Custom" as the service</li>
                <li>Paste the RTMP URL and Stream Key</li>
                <li>Click "Start Streaming"</li>
              </ol>
            </div>
            <div className="modal-actions">
              <button
                className="button button-outline"
                onClick={() => setShowStreamInfoModal(false)}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={handleContinueToLive}
              >
                Continue
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)}>
          <div className="modal-content">
            <h2 className="modal-title">Upload Video</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                className="input"
                name="title"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Enter video title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="input"
                name="description"
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe your video"
              />
            </div>
            <div className="form-group">
              <label>Video File</label>
              <input
                className="input"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, file: e.target.files[0] }))
                }
              />
            </div>
            <div className="modal-actions">
              <button
                className="button button-outline"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={handleUploadVideo}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Inline CSS */}
      <style>{`
        .dashboard-root { max-width: 900px; margin: 0 auto; padding: 24px; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .dashboard-title { font-size: 24px; font-weight: bold; }
        .dashboard-header-actions { display: flex; gap: 12px; }
        .button { padding: 8px 16px; font-size: 14px; border-radius: 4px; border: none; cursor: pointer; }
        .button-primary { background: #1d4ed8; color: #fff; }
        .button-outline { background: #fff; color: #1d4ed8; border: 1px solid #1d4ed8; }
        .button-danger { background: #dc2626; color: #fff; }
        .button-sm { padding: 4px 10px; font-size: 13px; }
        .button-icon { padding: 6px 8px; }
        .icon { vertical-align: middle; }
        .icon-lg { width: 48px; height: 48px; }
        .live-badge { background: #dc2626; color: #fff; padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px; }
        .card-live { border-color: #fca5a5; }
        .card-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; }
        .card-content { padding: 16px; }
        .video-preview { width: 100%; aspect-ratio: 16/9; background: #000; color: #fff; display: flex; justify-content: center; align-items: center; border-radius: 8px; margin-bottom: 18px; }
        .flex-col-center { display: flex; flex-direction: column; align-items: center; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .text-lg { font-size: 18px; }
        .text-sm { font-size: 14px; }
        .text-gray { color: #6b7280; }
        .text-red { color: #dc2626; }
        .font-bold { font-weight: bold; }
        .tags-list { display: flex; gap: 8px; }
        .tag { background: #e5e7eb; color: #374151; padding: 4px 8px; border-radius: 16px; font-size: 12px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 24px; }
        .tabs-root { margin-bottom: 32px; }
        .tabs-list { display: flex; gap: 2px; margin-bottom: 12px; }
        .tab { padding: 10px 18px; border: 1px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer; border-radius: 4px 4px 0 0; }
        .tab-active { background: #f3f4f6; color: #1d4ed8; font-weight: bold; }
        .tabs-content { background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 18px; }
        .video-item { display: flex; gap: 16px; margin-bottom: 16px; }
        .video-thumb { position: relative; width: 160px; height: 90px; border-radius: 8px; overflow: hidden; }
        .video-thumb-img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
        .video-duration { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: #fff; font-size: 12px; padding: 2px 6px; border-radius: 4px; }
        .video-info { flex: 1; }
        .video-title { font-size: 16px; font-weight: 500; }
        .video-meta { font-size: 14px; color: #6b7280; }
        .video-actions { margin-top: 8px; display: flex; gap: 8px; }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 16px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .modal-root { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); }
        .modal-box { background: #fff; width: 100%; max-width: 440px; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.18); position: relative; }
        .modal-content { padding: 28px 24px; }
        .modal-title { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
        .modal-desc { color: #6b7280; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .input { width: 100%; padding: 8px; font-size: 14px; border: 1px solid #d1d5db; border-radius: 4px; }
        .input-mono { font-family: monospace; }
        .form-hint { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 18px; }
        .modal-guide { background: #f3f4f6; padding: 14px; border-radius: 6px; margin-top: 14px; }
        .modal-guide-title { font-size: 15px; font-weight: 500; margin-bottom: 6px; }
        .modal-guide-list { font-size: 13px; color: #6b7280; margin-left: 18px; }
        .flex-row { display: flex; align-items: center; }
        .ml-1 { margin-left: 4px; }
        .ml-2 { margin-left: 8px; }
        .opacity-50 { opacity: 0.5; }
        .text-xs { font-size: 12px; }
      `}</style>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-root">
      <div className="modal-box">
        <button
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            background: "none",
            border: "none",
            color: "#aaa",
            fontSize: 22,
            cursor: "pointer",
          }}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value, desc }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="text-sm text-gray">{label}</span>
      </div>
      <div className="card-content">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray mt-1">{desc}</div>
      </div>
    </div>
  );
}

export default Dashboard;
