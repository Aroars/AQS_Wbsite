export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-packaging-scada",
    title: "What Is Packaging SCADA and Why Does Your Plant Need One?",
    description:
      "Most packaging lines run QC devices in isolation. Packaging SCADA connects them into one auditable network. Learn what it is and why it matters for food safety.",
    category: "Technology",
    categoryColor: "#00C6D7",
    readTime: "6 min",
    date: "March 2026",
    content: "what-is-packaging-scada",
  },
  {
    slug: "mag-drive-vs-conventional-gearbox",
    title:
      "Mag-Drive vs. Conventional Gearbox: The Case for Oil-Free Conveyors",
    description:
      "Conventional gearbox conveyors leak oil, require maintenance, and fail at the worst times. Mag-Drive eliminates all three. Here's how the technology compares.",
    category: "Engineering",
    categoryColor: "#F5A623",
    readTime: "5 min",
    date: "March 2026",
    content: "mag-drive-vs-conventional-gearbox",
  },
  {
    slug: "mechanical-vs-vision-leak-detection",
    title:
      "Mechanical vs. Vision-Based Leak Detection: Which Catches More?",
    description:
      "Vision systems miss micro-leaks. Mechanical suction-based leak detection catches what cameras can't see. Here's how the two approaches compare for food packaging.",
    category: "Technology",
    categoryColor: "#00C6D7",
    readTime: "5 min",
    date: "March 2026",
    content: "mechanical-vs-vision-leak-detection",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string): BlogPost[] {
  return blogPosts.filter((post) => post.slug !== currentSlug);
}
