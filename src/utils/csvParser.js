import csvParser from "csvtojson";

class CsvParser {
    #rawDatas

    constructor(rawDatas=[]){
        this.#rawDatas = rawDatas
    }

    async getMeasures(string) {
        throw new Error("Not implemented")
    }

    getMetadata(string) {
        const [code, name, latitude, longitude] = string
            .slice(0, 5)
            .map((data) => data.split(":")[1]);

        return {
            code:code.trim(),
            name:name.trim(),
            latitude:latitude.trim(),
            longitude:longitude.trim()
        }
    }

    async parser() {
        const parsed = [];

        for (const item of this.#rawDatas) {
            const data = item.trim().split("\n");

            const { code, name, latitude, longitude } = this.getMetadata(data)

            const measures = await this.getMeasures(data)

            parsed.push({
                code,
                name,
                latitude,
                longitude,
                measures,
            });
        }


        return parsed;
    }
}

class StationCsvParser extends CsvParser{
    constructor(rawDatas=[]){
        super(rawDatas)
    }

    async getMeasures(string){
        const data = string.slice(5).join("\n")

        const measures = await csvParser({
            delimiter: ",",
        }).fromString(data);

        return measures
    }
}

class RainGaugeCsvParser extends CsvParser{
    constructor(rawDatas=[]){
        super(rawDatas)
    }

    async getMeasures(string){
        const data = string.slice(4).join("\n")

        const measures = await csvParser({
            delimiter: ",",
        }).fromString(data);

        return measures
    }
}

export {
    StationCsvParser,
    RainGaugeCsvParser
}