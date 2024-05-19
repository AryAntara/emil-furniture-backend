type HTTPResponse = {
  success: boolean;
  data?: any;
  error?: any;
  message?: any;
};

export function respond(
  data: any,
  is_success: boolean,
  message?: string
): object {
  const response: HTTPResponse = {
    success: is_success,
    message,
  };

  if (!data) return response;

  if (!is_success) response["error"] = data;
  else response["data"] = data;

  return response;
}
