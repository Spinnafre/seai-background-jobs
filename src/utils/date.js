function formatDate(date, options, locale) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function getYesterdayDate({ date = new Date(), locale, formatOptions }) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return formatDate(previous, formatOptions, locale);
}

export { getYesterdayDate, formatDate };
