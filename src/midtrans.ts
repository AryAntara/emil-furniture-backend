import { Snap } from "midtrans-client";
import { Transaction } from "./models/Transaction";
import { logger } from "./log";
import { User } from "./models/User";

export async function generateSnapToken(
  transactionEntry: Transaction,
  userEntry: User
): Promise<string | null> {
  let snap = new Snap({
    isProduction: false,
    serverKey: process.env.SERVER_KEY ?? "",
  });

  let parameter = {
    transaction_details: {
      order_id: transactionEntry.getDataValue("id"),
      gross_amount: transactionEntry.getDataValue("priceTotal"),
    },
    customer_details: {
      first_name: userEntry.getDataValue("fullname"),
      last_name: "",
      email: userEntry.getDataValue("email"),
      phone: userEntry.getDataValue("phoneNumber"),
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    let { token } = transaction;
    return token;
  } catch (e) {
    console.log(e);
    logger.error(e);
    return null;
  }
}
