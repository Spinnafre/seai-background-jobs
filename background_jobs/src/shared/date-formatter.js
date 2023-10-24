export class DateFormatter {
  static dateTimeFormat(date, options, locale) {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  static timestampToDate(timestamp) {
    return new Date(timestamp * 1000);
  }

  static formatByDateSeparator(date, { separator } = { separator: "/" }) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = DateFormatter.padTo2Digits(`${day}`);
    month = DateFormatter.padTo2Digits(`${month}`);

    return `${year}${separator}${month}${separator}${day}`;
  }

  static getPreviousDate(date, prev) {
    const prev = new Date(date).setDate(date.getDate() - prev);
    // const date = Intl.DateTimeFormat("pt-BR").format(yesterday);
    return new Date(prev);
    // return Number((previous.valueOf() / 1000).toPrecision(10));
  }

  static dateToTimestamp(date) {
    return Number((date.valueOf() / 1000).toPrecision(10));
  }

  static padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  static convertDateStringToDate(dateString, separator = "/") {
    const [day, month, year] = dateString.split(separator);

    const isoStr = `${year}-${DateFormatter.padTo2Digits(
      month
    )}-${DateFormatter.padTo2Digits(day)}T00:00:00.000Z`;

    return new Date(isoStr);
  }
}
