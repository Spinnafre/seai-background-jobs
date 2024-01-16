export class FileNotFoundError extends Error {
  constructor(folderName) {
    super(`The file not founded in folder.`);
    this.name = "FileNotFoundError";
  }
}
