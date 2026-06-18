export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  quantity: number;
  lastUpdated: Date;
}

export interface CreateStockInput {
  symbol: string;
  name: string;
  price: number;
  quantity: number;
}

export interface UpdateStockInput {
  price?: number;
  quantity?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
