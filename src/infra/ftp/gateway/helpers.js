function filterDataByCodes(codes = [], data = []) {
  const filtered = data.filter((item) => codes.includes(item.code));
  return filtered;
}

export { filterDataByCodes };
