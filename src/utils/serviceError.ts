export type Error = {
  message: string;
  errors?: any;
};

export class ServiceError {
  static check(response: any): response is Error {
    return typeof response.message === "string";
  }
}
