const scrapperParams = {
  country: "NE",
  stations_type: "automaticas",
  state: "CE",
  date_type: null,
  params: [
    "Precipitação Total (mm)",
    "Temp. Média (°C)",
    "Umi. Média (%)",
    "Vel. do Vento Média (m/s)",
  ],
};

const urlToScrapper = "https://mapas.inmet.gov.br";

export { scrapperParams, urlToScrapper };
