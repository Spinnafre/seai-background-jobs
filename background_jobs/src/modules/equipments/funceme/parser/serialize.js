export class EquipmentSerializer {
  constructor(parser, mapper, filter) {
    this.parser = parser;
    this.filter = filter;
    this.mapper = mapper;
  }

  async parse(list) {
    if (list.length) {
      const raw = await this.parser.parse(list);
      return this.filter(raw).map(this.mapper.toDomain);
    }

    return null;
  }
}
