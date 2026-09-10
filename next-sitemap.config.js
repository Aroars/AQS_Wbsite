/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.automatedqs.com",
  generateRobotsTxt: false, // we maintain our own robots.txt
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*", "/toolbox/modular-belt-specs"],
  transform: async (config, path) => {
    // Higher priority for key pages
    const highPriority = ["/", "/solutions", "/solutions/veripak", "/solutions/intellipak"];
    // Every tool has its own page; the six the toolbox can rank for sit with the product pages
    const toolPriority = ["/toolbox/wearstrip-span-calculator", "/toolbox/mdr-hub-motor-selection", "/toolbox/belt-pull-calculator", "/toolbox/conveyor-speed-calculator", "/toolbox/conveyor-throughput-calculator", "/toolbox/light-curtain-safety-distance-calculator"];
    if (toolPriority.includes(path)) return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() };
    const medPriority = [
      "/solutions/conveyors",
      "/solutions/robotics",
      "/solutions/evacupak",
      "/solutions/leak-detection",
      "/toolbox",
      "/contact",
      "/about",
    ];

    let priority = config.priority;
    if (highPriority.includes(path)) priority = 1.0;
    else if (medPriority.includes(path)) priority = 0.8;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
