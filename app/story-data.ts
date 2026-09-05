export type Memory = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  description?: string;
  date: string;
  tags: string[];
  objectPosition?: string;
  align?: "left" | "center" | "right";
};

export type DiaryEntry = {
  id: string;
  title: string;
  date: string;
  category: string;
  mood?: string;
  content: string;
};

export type TimeCapsule = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  unlockAt: string;
  status: string;
};

export type VaultStats = {
  memories: number;
  letters: number;
  timeCapsules: number;
  videos: number;
};

export type SectionMeta = {
  id: string;
  label: string;
  title: string;
};

export const storyMedia: Memory[] = [
  {
    id: "01",
    type: "image",
    src: "/1.jpeg",
    title: "Our Beginning",
    description: "Where it all began.",
    date: "2019",
    tags: ["beginning", "2019"],
    objectPosition: "center 45%",
    align: "left",
  },
  {
    id: "02",
    type: "image",
    src: "/2.jpeg",
    title: "The first real chapter",
    description: "A quiet beginning with a lot of meaning.",
    date: "2019",
    tags: ["quiet", "story"],
    objectPosition: "center",
    align: "center",
  },
  {
    id: "03",
    type: "image",
    src: "/3.jpeg",
    title: "Still here",
    description: "A simple moment that stayed with us.",
    date: "2020",
    tags: ["memory", "favorite"],
    objectPosition: "center 35%",
    align: "right",
  },
  {
    id: "04",
    type: "video",
    src: "/4.mp4",
    poster: "/5.jpeg",
    title: "The feeling of being together",
    description: "Some moments stay in motion long after they pass.",
    date: "2022",
    tags: ["video", "movement"],
    objectPosition: "center",
    align: "left",
  },
  {
    id: "05",
    type: "image",
    src: "/5.jpeg",
    title: "A favorite place",
    description: "A place we could return to without needing words.",
    date: "2022",
    tags: ["favorite", "home"],
    objectPosition: "center",
    align: "center",
  },
  {
    id: "06",
    type: "image",
    src: "/6.jpeg",
    title: "A small smile",
    description: "The kind that changes the whole day.",
    date: "2023",
    tags: ["smile", "joy"],
    objectPosition: "center",
    align: "left",
  },
  {
    id: "07",
    type: "image",
    src: "/7.jpeg",
    title: "The ordinary turned beautiful",
    description: "It was never just an ordinary day.",
    date: "2024",
    tags: ["ordinary", "beautiful"],
    objectPosition: "center 40%",
    align: "right",
  },
  {
    id: "08",
    type: "video",
    src: "/8.mp4",
    poster: "/9.jpeg",
    title: "Unplanned, unforgettable",
    description: "The best moments were often the most unplanned ones.",
    date: "2024",
    tags: ["video", "unplanned"],
    objectPosition: "center",
    align: "left",
  },
  {
    id: "09",
    type: "image",
    src: "/9.jpeg",
    title: "That look",
    description: "The kind of look that makes everything else fade.",
    date: "2023",
    tags: ["look", "favorite"],
    objectPosition: "center",
    align: "center",
  },
  {
    id: "10",
    type: "image",
    src: "/10.jpeg",
    title: "Us in motion",
    description: "And somehow, even the quietest days felt full.",
    date: "2025",
    tags: ["motion", "us"],
    objectPosition: "center 30%",
    align: "right",
  },
  {
    id: "11",
    type: "image",
    src: "/11.jpeg",
    title: "A favorite frame",
    description: "The sort of memory that keeps getting better over time.",
    date: "2025",
    tags: ["favorite", "frame"],
    objectPosition: "center",
    align: "left",
  },
  {
    id: "12",
    type: "image",
    src: "/12.jpeg",
    title: "Still becoming",
    description: "This story keeps unfolding in the gentlest way.",
    date: "2025",
    tags: ["story", "forever"],
    objectPosition: "center 50%",
    align: "center",
  },
  {
    id: "13",
    type: "video",
    src: "/13.mp4",
    poster: "/14.jpeg",
    title: "The laugh that changed everything",
    description: "A memory with a soundtrack I can still hear.",
    date: "2025",
    tags: ["video", "laughter"],
    objectPosition: "center",
    align: "left",
  },
  {
    id: "14",
    type: "image",
    src: "/14.jpeg",
    title: "The one with a million details",
    description: "Not everything needs to be said aloud.",
    date: "2024",
    tags: ["detail", "memory"],
    objectPosition: "center",
    align: "right",
  },
  {
    id: "15",
    type: "image",
    src: "/15.jpeg",
    title: "The everyday miracle",
    description: "Maybe the best memories really are the quiet ones.",
    date: "2025",
    tags: ["quiet", "miracle"],
    objectPosition: "center 40%",
    align: "left",
  },
  {
    id: "16",
    type: "video",
    src: "/16.mp4",
    poster: "/17.jpeg",
    title: "A little chaos, a lot of joy",
    description: "And somehow it always felt right.",
    date: "2025",
    tags: ["video", "chaos"],
    objectPosition: "center",
    align: "center",
  },
  {
    id: "17",
    type: "image",
    src: "/17.jpeg",
    title: "This one stays with me",
    description: "The kind of image that feels like a memory in my chest.",
    date: "2024",
    tags: ["favorite", "still here"],
    objectPosition: "center 35%",
    align: "left",
  },
  {
    id: "18",
    type: "image",
    src: "/18.jpeg",
    title: "A soft return",
    description: "Some moments simply feel like home.",
    date: "2025",
    tags: ["home", "soft"],
    objectPosition: "center",
    align: "right",
  },
  {
    id: "19",
    type: "image",
    src: "/19.jpeg",
    title: "The weather changed",
    description: "But the feeling stayed the same.",
    date: "2024",
    tags: ["weather", "feeling"],
    objectPosition: "center 55%",
    align: "center",
  },
  {
    id: "20",
    type: "image",
    src: "/20.jpeg",
    title: "A tiny detail, a long memory",
    description: "The little things are still the biggest part of it.",
    date: "2025",
    tags: ["detail", "memory"],
    objectPosition: "center",
    align: "left",
  },
  {
    id: "21",
    type: "image",
    src: "/21.jpeg",
    title: "Always choosing us",
    description: "Even the smallest days felt like they belonged to us.",
    date: "2025",
    tags: ["us", "choice"],
    objectPosition: "center 42%",
    align: "right",
  },
  {
    id: "22",
    type: "image",
    src: "/22.jpeg",
    title: "The future is looking bright",
    description: "And there is still so much left to say and do.",
    date: "2025",
    tags: ["future", "bright"],
    objectPosition: "center",
    align: "center",
  },
];

export const diaryEntries: DiaryEntry[] = [
  {
    id: "entry-01",
    title: "Entry 01",
    date: "August 18, 2026",
    category: "Letter",
    mood: "Tender",
    content:
      "Today I realized that the best part of us is how easy it feels to be fully seen. Even the quietest days become gentle memories when you are in them.",
  },
  {
    id: "entry-02",
    title: "Entry 02",
    date: "July 02, 2026",
    category: "Note",
    mood: "Reflective",
    content:
      "Something I never said well enough is how much your presence has steadied me. You make ordinary moments feel like they were always waiting for us.",
  },
  {
    id: "entry-03",
    title: "A letter for later",
    date: "One day, when we need it",
    category: "Future",
    mood: "Hopeful",
    content:
      "When life feels loud, I hope you remember the way we made room for each other. We have always been better together, even before we knew how to name it.",
  },
];

export const timeCapsules: TimeCapsule[] = [
  {
    id: "cap-01",
    title: "Locked memory",
    content: "Open this when we need a reminder of how far we have come.",
    createdAt: "31 August 2026",
    unlockAt: "02 October 2027",
    status: "Still waiting for its time.",
  },
  {
    id: "cap-02",
    title: "A promise for later",
    content:
      "Some stories are meant to be remembered, and some are meant to be continued.",
    createdAt: "14 February 2026",
    unlockAt: "14 February 2027",
    status: "Locked for now.",
  },
  {
    id: "cap-03",
    title: "When we need courage",
    content:
      "This is for the days we forget how much love has already shaped us.",
    createdAt: "12 June 2026",
    unlockAt: "12 June 2028",
    status: "Waiting quietly.",
  },
];

export const vaultStats: VaultStats = {
  memories: 22,
  letters: 4,
  timeCapsules: 3,
  videos: 4,
};

export const sectionNavigation: SectionMeta[] = [
  { id: "01", label: "01", title: "Our Beginning" },
  { id: "02", label: "02", title: "Thank You" },
  { id: "03", label: "03", title: "Our Memories" },
  { id: "04", label: "04", title: "Our Chaos" },
  { id: "05", label: "05", title: "Our Words" },
  { id: "06", label: "06", title: "Future Us" },
  { id: "07", label: "07", title: "Still Growing" },
  { id: "08", label: "08", title: "Our Vault" },
];
