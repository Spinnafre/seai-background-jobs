class States {
  static states = {
    BA: { name: "Bahia", region: "Nordeste" },
    CE: { name: "Ceara", region: "Nordeste" },
    MA: { name: "Maranhao", region: "Nordeste" },
    PB: { name: "Paraiba", region: "Nordeste" },
    PE: { name: "Pernambuco", region: "Nordeste" },
    PI: { name: "Piaui", region: "Nordeste" },
    RN: { name: "Rio Grande do Norte", region: "Nordeste" },
    SE: { name: "Sergipe", region: "Nordeste" },
  };

  static findStateByKey(name) {
    if (Reflect.has(States.states, name)) {
      return States.states[name];
    }

    return null;
  }
}
