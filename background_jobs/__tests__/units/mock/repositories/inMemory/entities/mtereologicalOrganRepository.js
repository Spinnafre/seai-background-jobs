export class MetereologicalOrganRepositoryInMemory {
    #data = [{
        IdOgan:1,
        Name:"FUNCEME",
        Host:"testr",
        User:"test",
        Password:"test"
    }]
    constructor(data=[]) {
      this.#data = data;
    }
  
    async getOrganByName(organName) {
      const data = this.#data.filter((organ)=>organ.Name === organName)
      return data.length ? data.map((organ)=>{
        return {
            host: organ.Host,
            user: organ.User,
            password: organ.Password,
        }
      }) : null
    }
  }
  