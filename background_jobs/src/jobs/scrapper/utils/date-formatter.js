export class FormatDate {
  static formatDate(date, options, locale) {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
  static timestampToDate(timestamp, { separator } = { separator: "/" }) {
    const dateFormat = new Date(timestamp * 1000);
    let month = dateFormat.getMonth() + 1;
    let day = dateFormat.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${dateFormat.getFullYear()}${separator}${month}${separator}${day}`;
  }

  static getYesterdayTimestamp() {
    const date = new Date();
    const previous = new Date(date.getTime());

    previous.setDate(date.getDate() - 1);
    // previous.setMonth(date.getMonth() + 1);

    return Number((previous.valueOf() / 1000).toPrecision(10));
  }
}
