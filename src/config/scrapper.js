export default {
  page: {
    url: "https://mapas.inmet.gov.br",
    timeout: 40000,
  },
  toleranceTime: 60000,
  maxAttempts: 3,
  timeToAttemptAgain: 5000,
  launchConfig: {
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
    params: [
      "Precipitação Total (mm)",
      "Temp. Média (°C)",
      "Umi. Média (%)",
      "Vel. do Vento Média (m/s)",
    ],
  },
  validMeasures:[
    "Precipitação Total (mm)",
    "Vel. do Vento Média (m/s)",
    "Raj. do Vento Máxima (m/s)",
    "Temp. Média (°C)",
    "Temp. Máxima (°C)",
    "Temp. Mínima (°C)",
    "Umi. Média (%)",
    "Umi. Mínima (%)",
  ],
  validCountries : ["BRAZIL", "N", "NE", "CO", "SE", "S"],
  validStationsTypes :["todas", "automaticas", "convencionais"],
  validDates :["diario", "horario", "mensal", "prec", "extremos"]
};
