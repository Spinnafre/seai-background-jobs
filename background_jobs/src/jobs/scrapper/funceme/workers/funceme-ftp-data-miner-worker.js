export class FuncemeFTPDataMinerWorker {
  static name_queue = "funceme-scrapper";
  #controller = null;

  constructor(controller) {
    this.controller = controller;
    this.name_queue = FuncemeScrapperCommand.name_queue;
  }

  async handler(payload) {
    const resultOrError = await this.controller.handle(payload);
    if (resultOrError.isError()) {
      throw new Error(resultOrError.error());
    }
    return;
  }
}
