export class DbNewsLetterRepositoryInMemory {
  #newsList = [];
  #subscribers = [];

  constructor(news, subscribers) {
    this.#newsList = news;
    this.#subscribers = [...this.#subscribers, ...subscribers];
  }

  async getNewsById(id) {
    const data = this.#newsList.filter((news) => {
      return (news.Id = id);
    });

    return data.length ? data[0] : null;
  }
  async getSubscribers() {
    return this.#subscribers;
  }
}
