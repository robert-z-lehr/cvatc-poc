// Minimal demo resource dataset (Austin/UT area placeholders).
// Replace with authoritative sources later; keep this POC lightweight.

const CVATC_RESOURCES = {
  categories: [
    { key: "voting", label: "Voting", color: "#ffcc00" },
    { key: "libraries", label: "Libraries", color: "#2b8cff" },
    { key: "parks", label: "Parks", color: "#4cd964" },
    { key: "fire", label: "Fire Stations", color: "#ff4d4d" },
    { key: "other", label: "Other", color: "#b47cff" },
  ],

  // Default “QR location” if none provided:
  defaultSite: {
    siteId: "UT-DEMO",
    label: "UT Campus (Demo)",
    lat: 30.2849185,
    lng: -97.7340567,
  },

  // Highlighted public buildings (demo points).
  points: [
    {
      name: "Austin Public Library – Central Library",
      category: "libraries",
      lat: 30.2653,
      lng: -97.7498,
      info: "Central branch (demo).",
      link: "https://library.austintexas.gov/central-library"
    },
    {
      name: "Perry-Castañeda Library (PCL)",
      category: "libraries",
      lat: 30.2826,
      lng: -97.7382,
      info: "UT library (demo).",
      link: "https://www.lib.utexas.edu/about/locations/pcl"
    },
    {
      name: "Waterloo Park",
      category: "parks",
      lat: 30.2729,
      lng: -97.7370,
      info: "Downtown park (demo).",
      link: "https://waterloogreenway.org/places/waterloo-park/"
    },
    {
      name: "Austin Fire Station 1",
      category: "fire",
      lat: 30.2665,
      lng: -97.7429,
      info: "Fire station (demo).",
      link: "https://www.austintexas.gov/department/austin-fire"
    },
    {
      name: "Travis County Courthouse",
      category: "other",
      lat: 30.2678,
      lng: -97.7397,
      info: "Courts (demo).",
      link: "https://www.traviscountytx.gov/"
    },
    {
      name: "Voting Info (Travis County Elections)",
      category: "voting",
      lat: 30.2673,
      lng: -97.7426,
      info: "Use official site for polling/early voting.",
      link: "https://votetravis.gov/"
    }
  ]
};
