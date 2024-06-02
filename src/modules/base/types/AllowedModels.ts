import { Address } from "../../../models/Address";
import { User } from "../../../models/User";
import { Category } from "../../../models/Category";
import { Product } from "../../../models/Product";
import { Stock } from "../../../models/Stock";
import { Cart } from "../../../models/Cart";
import { CartDetail } from "../../../models/CartDetail";
import { Order } from "../../../models/Order";
import { OrderDetail } from "../../../models/OrderDetail";

export type AllowedModels =
  | Address
  | User
  | Category
  | Product
  | Stock
  | Cart
  | CartDetail
  | Order
  | OrderDetail;
