function formatDate(date, options, locale) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatDateToForwardSlash(timestamp) {
  // Necessário multiplicar por 1000 devido ao fato do Js trabalhar com mais dados de tempo
  const dateFormat = new Date(timestamp * 1000);

  let month = dateFormat.getMonth();
  let day = dateFormat.getDate();
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  return `${dateFormat.getFullYear()}/${month}/${day}`;
}

function formatDateToHyphenFormat(timestamp) {
  const dateFormat = new Date(timestamp * 1000);

  let month = dateFormat.getMonth();
  let day = dateFormat.getDate();
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  return `${dateFormat.getFullYear()}-${month}-${day}`;
}

function getYesterdayTimestamp() {
  const date = new Date();
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);
  return Number((previous.valueOf() / 1000).toPrecision(10));
}
function getYesterdayDateFormatted({ locale, formatOptions }) {
  const previous = getYesterday();

  return formatDate(previous, formatOptions, locale);
}

export {
  getYesterdayDateFormatted,
  formatDate,
  formatDateToForwardSlash,
  formatDateToHyphenFormat,
  getYesterdayTimestamp,
};
