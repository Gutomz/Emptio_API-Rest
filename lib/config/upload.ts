import * as fs from 'fs';

export class UploadConfig {
  public static userFolder: string = '/user';
  public static productFolder: string = '/product';
  public static marketFolder: string = '/market';

  public static getPath(): string {
    const path = __dirname.replace('\\dist\\config', '').replace(/\\/g, "/");
    const extension = '/uploads';
    return path + extension;
  }

  public static init() {
    UploadConfig.validatePath(this.getPath());

    const folders = [
      UploadConfig.userFolder,
      UploadConfig.productFolder,
      UploadConfig.marketFolder,
    ];

    for(let index in folders) {
      const folder = folders[index];

      this.generateFolder(folder);
    }
  }

  public static generateFolder(folder: string) {
    const path = UploadConfig.getPath() + folder;
    UploadConfig.validatePath(path);
  }

  public static validatePath(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
}
