import React, { useEffect, useState } from "react";
import { videos, categories } from "../../data/mockData.js";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import VideoCard from "../../components/VideoCard.jsx";
import { getLiveStreams, getVideos } from "../../api/auth.js";
import { formatDate, formatDuration } from "../../utils/utility.js";
const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All"
  const [liveStreams, setLiveStreams] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // Filter videos based on selected category (for demo, we just show all videos)
  const filteredVideos =
    selectedCategory === 7 ? videos.filter((video) => video.isLive) : videos;

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const response = await getLiveStreams();
        if (response.status === 200) {
          setLiveStreams(response.data.data);
        } else {
          console.error("Failed to fetch live streams");
        }
      } catch (error) {
        console.error("Error fetching live streams:", error);
      }
    };
    const fetchVideos = async () => {
      try {
        const response = await getVideos();
        if (response.status === 200) {
          setIsVideoLoaded(true);
          setVideos(response.data.data);
        } else {
          console.error("Failed to fetch videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
    fetchLiveStreams();
  }, []);
  console.log(liveStreams);
  return (
    <div style={styles.container}>
      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Featured Section */}
      {selectedCategory === 1 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Featured Streams</h2>
          <div style={styles.grid}>
            {videos
              .filter((video) => video.isLive)
              .slice(0, 2)
              .map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
          </div>
        </div>
      )}

      {/* Live Now Section */}
      {liveStreams.length !== 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Live Now</h2>
          <div style={styles.grid}>
            {liveStreams.map((video) => {
              return (
                <VideoCard
                  key={video._id}
                  id={video.streamKey}
                  title={video.title}
                  thumbnail={video.thumbnailUrl}
                  views={300}
                  postedAt={formatDate(video.createdAt)}
                  duration={formatDuration(video.duration)}
                  creator={
                    video.channelId
                      ? {
                          name: video.channelId.name,
                          avatar: video.channelId.avatarUrl,
                        }
                      : { name: "Unknown", avatar: "" }
                  }
                  isLive={true}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Main Videos Grid */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {selectedCategory === 1
            ? "Recommended Videos"
            : selectedCategory === 7
            ? "Live Streams"
            : `${
                categories.find((c) => c.id === selectedCategory)?.name
              } Videos`}
        </h2>
        <div style={styles.grid}>
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              id={video._id}
              title={video.title}
              thumbnail={video.thumbnailUrl}
              views={video.views}
              postedAt={formatDate(video.createdAt)}
              duration={formatDuration(video.duration)}
              creator={
                video.channelId
                  ? {
                      name: video.channelId.name,
                      avatar: video.channelId.avatarUrl,
                    }
                  : { name: "Unknown", avatar: "" }
              }
              isLive={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px",
  },
  section: {
    marginTop: "32px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
};

export default HomePage;
