import React, { useState } from "react";
import { videos, categories } from "../../data/mockData.js";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import VideoCard from "../../components/VideoCard.jsx";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All"

  // Filter videos based on selected category (for demo, we just show all videos)
  const filteredVideos =
    selectedCategory === 7 ? videos.filter((video) => video.isLive) : videos;

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
      {selectedCategory !== 7 && videos.some((video) => video.isLive) && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Live Now</h2>
          <div style={styles.grid}>
            {videos
              .filter((video) => video.isLive)
              .map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
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
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
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
