import zlib from "zlib";
import tar from "tar-stream";

function unTar(tarballStream) {
  const results = {}; // [fileName] : Buffer
  return new Promise((resolve, reject) => {
    const extract = tar.extract();

    extract.on("entry", async function (header, stream, next) {
      const chunks = [];
      // Semelhante ao stream.on('data',()=>{})
      for await (let chunk of stream) {
        chunks.push(chunk);
      }
      //Transforma array de buffers em um único buffer
      results[header.name] = Buffer.concat(chunks);
      next();
    });

    extract.on("finish", function () {
      resolve(results);
    });

    tarballStream.pipe(zlib.createUnzip()).pipe(extract);
  });
}

export { unTar };
