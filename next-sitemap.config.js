/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://automatedqs.com",
  generateRobotsTxt: false, // we maintain our own robots.txt
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  // Toolbox, calculators, and /apps stay out of the sitemap while TOOLBOX_ENABLED is false in next.config.ts.
  exclude: ["/api/*", "/toolbox", "/toolbox/*", "/calculators", "/calculators/*", "/apps", "/apps/*"],
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
    let changefreq = config.changefreq;
    if (highPriority.includes(path)) priority = 1.0;
    else if (medPriority.includes(path)) priority = 0.8;
    // Conveyor section: hub, families, and type pages carry the product weight;
    // project spotlights are long-lived articles
    else if (path.startsWith("/solutions/conveyors/projects/")) { priority = 0.7; changefreq = "monthly"; }
    else if (path.startsWith("/solutions/conveyors/")) priority = 0.8;

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
