import { pipeline } from "node:stream/promises";

export function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export function blobToBase64(blob) {
  return blob.stream().pipeThrough(new TextDecoderStream());
}

function toBlob() {
  return new TransformStream({
    transform(chunk, controller) {
      const dataURL = chunk.toString();
      controller.enqueue(dataURItoBlob(dataURL));
    },
  });
}

export function bufferToBlob(contentBuffer) {
  const buffer = Buffer.from(contentBuffer); // converte para buffer de dados binários crús (chunk of data)

  return new Blob([buffer]);
}

export async function blobToHTML(blob) {
  const readable = blobToBase64(blob).pipeThrough(toBlob());

  let html = "";
  await pipeline(
    readable,
    new WritableStream({
      async write(chunks, controller) {
        const stream = chunks.stream().pipeThrough(new TextDecoderStream());
        for await (const chunk of stream) {
          // console.log(chunk);
          html += chunk;
        }
      },
    })
  );

  return html;
}
