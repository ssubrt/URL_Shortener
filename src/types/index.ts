export interface User {
  id: string;
  email: string;
}

export interface Link {
  id: string;
  userId: string;
  originalUrl: string;
  shortUrl: string;
  alias?: string;
  expiresAt?: Date;
  createdAt: Date;
  clicks: number;
}

export interface AnalyticsData {
  deviceType: string;
  browser: string;
  ip: string;
  timestamp: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}