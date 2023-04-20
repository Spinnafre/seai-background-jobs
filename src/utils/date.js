function formatDate(date, options, locale) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatDateToYYMMDD(date = new Date()) {
  let month = date.getUTCMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  return `${date.getFullYear()}-${month}-${day}`;
}
function getYesterday() {
  const date = new Date();
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);
  return previous;
}
function getYesterdayDateFormatted({ locale, formatOptions }) {
  const previous = getYesterday();

  return formatDate(previous, formatOptions, locale);
}

export {
  getYesterdayDateFormatted,
  formatDate,
  formatDateToYYMMDD,
  getYesterday,
};
