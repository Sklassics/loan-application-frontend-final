export interface IResponse<T> {
    creditLimit: undefined;
    status: number;
    data?: T;
    token?: string,
    message?: string | null;
    error?: any;
    success?: boolean
  }
  