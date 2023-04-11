export default {
  page: {
    url: "https://mapas.inmet.gov.br",
    timeout: 30000,
  },
  toleranceTime: 30000,
  maxAttempts: 3,
  timeToAttemptAgain: 10000,
  launchConfig: {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
    launch: {
      headless: true,
      args: ["--no-sandbox"],
    },
  },
};
