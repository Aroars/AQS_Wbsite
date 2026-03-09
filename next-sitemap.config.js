/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.automatedqs.com",
  generateRobotsTxt: false, // we maintain our own robots.txt
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*"],
  transform: async (config, path) => {
    // Higher priority for key pages
    const highPriority = ["/", "/solutions", "/solutions/veripak", "/solutions/intellipak"];
    const medPriority = [
      "/solutions/conveyors",
      "/solutions/robotics",
      "/solutions/evacupak",
      "/solutions/leak-detection",
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
