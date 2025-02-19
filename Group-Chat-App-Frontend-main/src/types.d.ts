declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface User {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  role: "USER" | "ADMIN";
  groups: Group[];
  createdAt: string,
  updatedAt: string;
  imageUrl: string
}

interface ApiResponse<T> {
  data: T;
  message: string;
  sucess: boolean
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  AccessToken: string;
  refreshToken: string;
}

type RefreshTokenResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

interface Group {
  _id: string;
  name: string;
  type: "public" | "private";
  admin: string;
  members: string[];
  inviteToken?: string; // Optional, since it's empty in the given data
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SenderID {
  _id: string;
  name: string;
  email: string;
}
interface Message {
  _id: string;
  groupId: string;
  senderId: SenderID;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

