import { useEffect, useState } from "react";
import { categories } from "../../data/mockData.js";
import { Search } from "lucide-react"; // Add this import at the top
import CategoryFilter from "../../components/CategoryFilter.jsx";
import VideoCard from "../../components/VideoCard.jsx";
import { getLiveStreams, getVideos } from "../../api/auth.js";
import { formatDate, formatDuration } from "../../utils/utility.js";
import { useSearch } from "../../context/SearchContext.jsx";
const HomePage = () => {
  const { searchQuery } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All"
  const [liveStreams, setLiveStreams] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // Filter videos based on selected category (for demo, we just show all videos)

  const filteredVideos =
    searchQuery.length == 0
      ? []
      : videos.filter(
          (video) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (video.channelId?.name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

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

      {/* Search Section*/}
      {filteredVideos.length !== 0 && (
        <div style={styles.searchSection}>
          <h2 style={styles.searchSectionTitle}>
            <Search style={styles.searchIcon} />
            SearchResult
          </h2>
          <div style={styles.grid}>
            {filteredVideos.map((video) => (
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
                  id={video._id}
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
  searchSection: {
    marginTop: "32px",
    background: "linear-gradient(90deg, #e0e7ff 0%, #f3f4f6 100%)",
    border: "2px solid #6366F1",
    borderRadius: "12px",
    boxShadow: "0 2px 16px 0 rgba(99, 102, 241, 0.10)",
    padding: "24px 16px",
    marginBottom: "32px",
    position: "relative",
  },
  searchSectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#4338ca",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  searchIcon: {
    color: "#6366F1",
    width: "22px",
    height: "22px",
  },
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
