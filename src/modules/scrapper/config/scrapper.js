export default {
  page: {
    url: "https://mapas.inmet.gov.br",
    timeout: 70000,
  },
  toleranceTime: 60000,
  maxAttempts: 3,
  timeToAttemptAgain: 5000,
  launchConfig: {
    bypass: true,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
    launch: {
      headless: true,
      args: ["--no-sandbox"],
    },
  },
  params: {
    country: "NE",
    stations_type: "automaticas",
    state: "CE",
    date_type: "diario",
  },
  validCountries: ["BRAZIL", "N", "NE", "CO", "SE", "S"],
  validStationsTypes: ["todas", "automaticas", "convencionais"],
  validDates: ["diario", "horario", "mensal", "prec", "extremos"],
};
