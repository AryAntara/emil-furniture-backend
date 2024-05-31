import { Address } from "../../../models/Address";
import { User } from "../../../models/User";
import { Category } from "../../../models/Category";
import { Product } from "../../../models/Product";
import { Stock } from "../../../models/Stock";
import { Order } from "../../../models/Cart";
import { OrderDetail } from "../../../models/CartDetail";

export type AllowedModels = Address | User | Category | Product| Stock| Order | OrderDetail;
