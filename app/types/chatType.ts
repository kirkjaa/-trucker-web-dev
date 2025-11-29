import { EChatMessageType, ESortDirection } from "./enum";

export interface IChatGroup {
  groupId: string;
  groupName: string;
  lastMessage: string;
  createdAt: Date;
}

export interface IChatMessageId {
  id: string;
}

export interface IChatMessageCustomExts {
  payloadUrl?: string;
}

export interface IChatMessageBody {
  msg: string;
  customEvent?: string;
  customExts?: IChatMessageCustomExts;
}

export interface IChatMessageRequest {
  search?: string;
  sortBy?: number;
  chatGroupId: string;
  page: number;
  limit: number;
  sortDirection: ESortDirection;
}

export interface IChatMessage {
  id: string;
  type: EChatMessageType;
  to: IChatMessageBody[];
  body: IChatMessageBody;
  from: IChatForm;
  createdAt: Date;
}

export interface IChatPushMessageRequest {
  payload?: File;
  type: EChatMessageType;
  to: string[];
  text: string;
}

export interface IChatForm {
  id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
}
