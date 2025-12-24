import { _axios } from "@/helper/axios";

export interface SendMessageData {
  phone: string;
  message: string;
}

export class MessagesApiData {
  getMessagesByPhone = async (phone:string) => {
    return await _axios("get", true, `/api/whatsapp/chats/${phone}`);
  };

  getAllChats = async ()=>{
    return await _axios("get", true, "/api/whatsapp/chats")
  };
  
  addMessage = async (data: SendMessageData) => {
    return await _axios("post", true, "/api/whatsapp/chats/send", data);
  };
}