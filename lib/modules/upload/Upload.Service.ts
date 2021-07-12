import * as base64ToImage from 'base64-to-image';
import * as fs from 'fs';
import { Document } from 'mongoose';
import { UploadConfig } from '../../config/upload';
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

  constructor() {
    this.uploadsFolder = UploadConfig.getPath();
    this.baseLink = environment.getStaticURL();
  }

  private getFullUploadsPath(pathExtension: string = '') {
    return this.uploadsFolder + pathExtension + '/'
  }

  private generateLink(filename: string, extension: string = "") {
    return environment.static + extension + '/' + filename;
  }

  private parsePathFromLink(link: string): string {
    const parsed = link.replace(this.baseLink, "").replace(environment.static, "");
    return this.uploadsFolder + parsed;
  }

  private uploadFile(data: string, document: Document, pathExtension?: string): IUploadFileResponse {
    const options: IUploadFileOptions = {
      fileName: (document && document.id ? document.id : 'img-') + Date.now().toString(),
    };

    const path = this.getFullUploadsPath(pathExtension);
    return base64ToImage(data, path, options);
  }

  public async uploadProfilePhoto(base64Data: string, user?: Document): Promise<IUploadResponse> {
    const upload = this.uploadFile(base64Data, user, UploadConfig.userFolder);

    return {
      link: this.generateLink(upload.fileName, UploadConfig.userFolder),
    };
  }

  public async uploadProductImage(base64Data: string, product?: Document): Promise<IUploadResponse> {
    const upload = this.uploadFile(base64Data, product, UploadConfig.productFolder);

    return {
      link: this.generateLink(upload.fileName, UploadConfig.productFolder),
    };
  }

  public async uploadMarketImage(base64Data: string, market?: Document): Promise<IUploadResponse> {
    const upload = this.uploadFile(base64Data, market, UploadConfig.marketFolder);

    return {
      link: this.generateLink(upload.fileName, UploadConfig.marketFolder),
    };
  }

  public async deleteLink(link: string) {
    const path = this.parsePathFromLink(link);
    fs.unlinkSync(path);
  }
}

export default new UploadService();
