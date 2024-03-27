export class EquipmentSerializer {
  constructor(parser, filter, mapper) {
    this.parser = parser;
    this.mapper = mapper;
    this.filter = filter;
  }

  async parse(list) {
    if (list.length) {
      const raw = await this.parser.parse(list);
      return this.filter(raw).map(this.mapper.toDomain);
    }

    return null;
  }
}
