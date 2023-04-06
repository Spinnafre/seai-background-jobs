// Functions utils to be used anywhere

function* dataAsStream(array) {
  yield* array;
}

export { dataAsStream };
