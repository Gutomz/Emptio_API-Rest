import * as base64ToImage from 'base64-to-image';
import * as fs from 'fs';
import environment from "../../environment";

interface IUploadFileResponse {
  imageType: string;
  fileName: string;
}

interface IUploadFileOptions {
  fileName?: string;
  type?: string;
  debug?: boolean;
}

export interface IUploadResponse {
  link: string;
}

class UploadService {
  uploadsFolder: string;
  baseLink: string;
  private profileFolder: string = '/profile';

  constructor() {
    this.uploadsFolder = environment.getUploadsPath();
    this.baseLink = environment.getStaticURL();
  }

  private getFullUploadsPath(pathExtension: string = '') {
    return this.uploadsFolder + pathExtension + '/'
  }

  private generateLink(filename: string, extension: string = "") {
    return this.baseLink + extension + '/' + filename;
  }

  private parsePathFromLink(link: string): string {
    const parsed = link.replace(this.baseLink, "");
    console.log(parsed)
    return this.getFullUploadsPath(parsed);
  }

  private uploadFile(data: string, pathExtension?: string, options?: IUploadFileOptions): IUploadFileResponse {
    const path = this.getFullUploadsPath(pathExtension);
    return base64ToImage(data, path, options);
  }

  public async uploadProfilePhoto(base64Data: string, user?: any): Promise<IUploadResponse> {
    const options: IUploadFileOptions = {
      fileName: (user && user.id ? user.id : 'img-') + Date.now().toString(),
    };

    const upload = this.uploadFile(base64Data, this.profileFolder, options);

    return {
      link: this.generateLink(upload.fileName, this.profileFolder),
    };
  }

  public async deleteLink(link: string) {
    const path = this.parsePathFromLink(link);

    fs.unlinkSync(path);
  }
}

export default new UploadService();
