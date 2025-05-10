export const videos = [
  {
    id: 1,
    title: "Introduction to React Fundamentals",
    thumbnail:
      "https://placehold.co/600x400/3178C6/FFFFFF/png?text=React+Fundamentals",
    views: "15K",
    postedAt: "2 weeks ago",
    duration: "45:21",
    creator: {
      name: "Manish Khatri",
      avatar: "https://placehold.co/100/4F46E5/FFFFFF/png?text=SJ",
    },
    isLive: false,
  },
  {
    id: 2,
    title: "Advanced Calculus: Solving Real-World Problems",
    thumbnail: "https://placehold.co/600x400/6366F1/FFFFFF/png?text=Calculus",
    views: "8.2K",
    postedAt: "3 days ago",
    duration: "1:12:45",
    creator: {
      name: "Dr. Michael Chen",
      avatar: "https://placehold.co/100/F59E0B/FFFFFF/png?text=MC",
    },
    isLive: false,
  },
  {
    id: 3,
    title: "Literature Analysis: Shakespeare's Macbeth",
    thumbnail: "https://placehold.co/600x400/10B981/FFFFFF/png?text=Literature",
    views: "5.7K",
    postedAt: "1 week ago",
    duration: "58:33",
    creator: {
      name: "Prof. Emily Rodriguez",
      avatar: "https://placehold.co/100/EC4899/FFFFFF/png?text=ER",
    },
    isLive: false,
  },
  {
    id: 4,
    title: "LIVE: Q&A Session - Physics Final Exam Review",
    thumbnail:
      "https://placehold.co/600x400/EF4444/FFFFFF/png?text=LIVE+Physics",
    views: "423 watching",
    postedAt: "Live now",
    creator: {
      name: "Dr. Robert Feynman",
      avatar: "https://placehold.co/100/3B82F6/FFFFFF/png?text=RF",
    },
    streamUrl: "http://localhost:8080/hls/night/index.m3u8", // for live
    isLive: true,
  },
  {
    id: 5,
    title: "Chemistry Lab: Solutions and Mixtures",
    thumbnail: "https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=Chemistry",
    views: "12K",
    postedAt: "5 days ago",
    duration: "42:18",
    creator: {
      name: "Prof. Lisa Chang",
      avatar: "https://placehold.co/100/9333EA/FFFFFF/png?text=LC",
    },
    isLive: false,
  },
  {
    id: 6,
    title: "LIVE: Interactive Coding Session - Building a Web App",
    thumbnail:
      "https://placehold.co/600x400/F43F5E/FFFFFF/png?text=LIVE+Coding",
    views: "752 watching",
    postedAt: "Live now",
    creator: {
      name: "Prof. David Miller",
      avatar: "https://placehold.co/100/06B6D4/FFFFFF/png?text=DM",
    },
    streamUrl: "http://localhost:8080/hls/night/index.m3u8", // for live
    isLive: true,
  },
  {
    id: 7,
    title: "History: The Renaissance Period and Cultural Impact",
    thumbnail: "https://placehold.co/600x400/FB7185/FFFFFF/png?text=History",
    views: "9.8K",
    postedAt: "1 month ago",
    duration: "1:05:27",
    creator: {
      name: "Dr. Samuel Wilson",
      avatar: "https://placehold.co/100/F97316/FFFFFF/png?text=SW",
    },

    isLive: false,
  },
  {
    id: 8,
    title: "Biology: Understanding DNA Replication",
    thumbnail: "https://placehold.co/600x400/22C55E/FFFFFF/png?text=Biology",
    views: "14K",
    postedAt: "2 weeks ago",
    duration: "37:41",
    creator: {
      name: "Prof. Amelia Parker",
      avatar: "https://placehold.co/100/84CC16/FFFFFF/png?text=AP",
    },
    isLive: false,
  },
];

export const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Mathematics" },
  { id: 3, name: "Science" },
  { id: 4, name: "Computer Science" },
  { id: 5, name: "Literature" },
  { id: 6, name: "History" },
  { id: 7, name: "Live Now" },
  { id: 8, name: "Recently Uploaded" },
];
