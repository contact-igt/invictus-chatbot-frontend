import { _axios } from "@/helper/axios";

export interface uploadFilesData {
  recipient: string;
  message: string;
  chatId: number;
}

export class UploadFilesApiData {
    uploadFiles = async (data: any) => {
    return await _axios("post", false, "/api/upload-file", data);
  };
}