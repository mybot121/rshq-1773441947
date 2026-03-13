
export type Platform = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'twitter' | 'telegram' | 'other';

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  pricePer1000: number;
  minOrder: number;
  maxOrder: number;
  description: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  platform: Platform;
  imageUrl: string;
  serviceCount: number;
  color?: string; // الحقل الجديد للون القسم
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  link: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  cost: number;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  balance: number;
  isAdmin: boolean;
}

export interface Transfer {
  id: string;
  fromUsername: string;
  toUsername: string;
  fromEmail: string;
  toEmail: string;
  amount: number;
  createdAt: number;
}

export interface RechargeRequest {
  id: string;
  userId: string;
  userEmail: string;
  method: 'asiacell';
  senderNumber: string;
  amountUsd: number;
  amountIqd: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface ProviderSettings {
  url: string;
  apiKey: string;
}
