// midtrans-cli.d.ts
declare module "midtrans-client" {
  class HttpClient {}
  export class Transaction {
    private parent: { apiConfig: ApiConfig; httpClient: HttpClient };
  
    constructor(parentObj: { apiConfig: ApiConfig; httpClient: HttpClient });
  
    /**
     * Fetches the status of a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to retrieve the status for. Defaults to an empty string.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    status(transactionId?: string): Promise<any>;
  
    /**
     * Fetches the B2B status of a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to retrieve the B2B status for. Defaults to an empty string.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    statusb2b(transactionId?: string): Promise<any>;
  
    /**
     * Approves a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to approve. Defaults to an empty string.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    approve(transactionId?: string): Promise<any>;
  
    /**
     * Denies a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to deny. Defaults to an empty string.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    deny(transactionId?: string): Promise<any>;
  
    /**
     * Cancels a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to cancel. Defaults to an empty string.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    cancel(transactionId?: string): Promise<any>;
  
    /**
     * Expires a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to expire. Defaults to an empty string.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    expire(transactionId?: string): Promise<any>;
  
    /**
     * Initiates a refund for a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to refund. Defaults to an empty string.
     * @param parameter (optional) An object containing additional parameters for the refund request.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    refund(transactionId?: string, parameter?: any): Promise<any>;
  
    /**
     * Initiates a direct online refund for a transaction.
     * 
     * @param transactionId (optional) The ID of the transaction to refund. Defaults to an empty string.
     * @param parameter (optional) An object containing additional parameters for the refund request.
     * @returns A promise that resolves to the response from the Midtrans API.
     */
    refundDirect(transactionId?: string, parameter?: any): Promise<any>;
  
    /**
     * Processes a notification from Midtrans.
     * 
     * @param notificationObj A string containing the notification JSON or a notification object.
     * @returns A promise that resolves to the response from the `status` method for the extracted transaction ID. Rejects if the notification cannot be parsed or an error occurs during status retrieval.
     */
    notification(notificationObj: string | object): Promise<any>;
  }

  export class ApiConfig {
    /**
     * Flag indicating production or sandbox environment.
     */
    isProduction: boolean;

    /**
     * Server key for Midtrans API access.
     */
    serverKey: string;

    /**
     * Client key for Midtrans API access.
     */
    clientKey: string;

    /**
     * Initiate with options
     * @param  {ApiConfigOptions} options - should have these props:
     * isProduction, serverKey, clientKey
     */
    constructor(options?: ApiConfigOptions);

    /**
     * Return config stored as a plain object.
     * @return {ApiConfigOptions} object contains isProduction, serverKey, clientKey
     */
    get(): ApiConfigOptions;

    /**
     * Set config stored
     * @param {ApiConfigOptions} options - object contains isProduction, serverKey, clientKey]
     */
    set(options: ApiConfigOptions): void;

    /**
     * @return {string} core api base url
     */
    getCoreApiBaseUrl(): string;

    /**
     * @return {string} snap api base url
     */
    getSnapApiBaseUrl(): string;

    /**
     * @return {string} Iris api base url
     */
    getIrisApiBaseUrl(): string;
  }

  /**
   * Interface defining options for ApiConfig constructor and set method.
   */
  interface ApiConfigOptions {
    isProduction?: boolean;
    serverKey: string;
    clientKey?: string;
  }

  export class Snap {
    apiConfig: ApiConfig;
    httpClient: HttpClient;
    transaction: Transaction;

    constructor(options?: SnapOptions);

    createTransaction(parameter?: any): Promise<any>;
    createTransactionToken(parameter?: any): Promise<string>;
    createTransactionRedirectUrl(parameter?: any): Promise<string>;
  }

  interface SnapOptions {
    isProduction?: boolean;
    serverKey: string;
    clientKey?: string;
  }

  // You would also need separate .d.ts files for ApiConfig, HttpClient, and Transaction
}
