function filterDataByCodes(codes = [], data = []) {
  const filtered = data.filter((item) => codes.includes(item.code));
  return filtered;
}
function filterMeasuresByDate(date, data = []) {
  data.map((item) => {
    const measures = item.measures.filter((measures) => measures.data === date);
    item.measures = measures;
  });
  return data;
}

export { filterDataByCodes, filterMeasuresByDate};
