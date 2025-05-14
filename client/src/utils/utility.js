export const formatDate = (date) => {
  // i want it like youtube like minutes ago seconds ago days
  date = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return `${days} days ago`;
  if (months < 12) return `${months} months ago`;
  return `${years} years ago`;
};

export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    // Format: H:MM:SS
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  } else {
    // Format: M:SS
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
};

export function toLiveReactingEmbedUrl(hlsUrl) {
  const base = "https://www.livereacting.com/tools/hls-player-embed?url=";
  return base + encodeURIComponent(hlsUrl);
}
