import { User } from "./User";
import { Address } from "./Address";

// UserAddress
Address.belongsTo(User)
User.hasMany(Address)



