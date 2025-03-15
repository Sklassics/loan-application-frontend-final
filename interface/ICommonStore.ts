export interface IResponse<T> {
    status: number;
    data?: T;
    token?: string,
    message?: string | null;
    error?: any;
  }
  