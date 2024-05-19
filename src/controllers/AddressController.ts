import { Context } from "hono";
import { AddressService } from "../modules/address/AddressService";
import { insertSchemaValidator } from "../modules/address/schemas/InsertSchema";
import { BaseController } from "./BaseController";
import { updateSchemaValidator } from "../modules/address/schemas/UpdateSchema";
import { deleteSchemaValidator } from "../modules/address/schemas/deleteSchema";
import { setActiveSchemaValidator } from "../modules/address/schemas/setActiveSchema";

export class AddressController extends BaseController {
  constructor(private addressService: AddressService) {
    super();
  }

  // list of address
  async list(c: Context) {
    const userId = await c.get("userId");
    const addressEntries = await this.addressService.findByUserId(
      userId as number
    );
    return c.json(
      this.respond(addressEntries, true, "Berhasil mendapatkan data.")
    );
  }

  // insert address based on loginned user
  async insert(c: Context) {
    const userId = await c.get("userId");
    const content = await c.req.json();
    const validation = await insertSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    data.userId = userId;

    if (await this.addressService.isLimitReached(userId))
      return c.json(
        this.respond(
          null,
          false,
          `Tidak bisa menambahkan alamat lagi, kamu sudah punya ${AddressService.LIMIT_ADDRESS_COUNT}`
        ),
        400
      );
    if (!(await this.addressService.insert(data)))
      return c.json(
        this.respond(null, false, "Tidak bisa menambah alamat."),
        500
      );

    return c.json(this.respond(null, true, "Berhasil menambah alamat"));
  }

  // update address data
  async update(c: Context) {
    const addressId = parseInt(c.req.param().addressId);
    const content = await c.req.json();
    const userId = parseInt(c.get("userId"));

    // includes parameter into validation
    content._user_id = userId;
    content.address_id = addressId;

    const validation = await updateSchemaValidator.with(content).run();
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    delete data.addressId;

    if (!(await this.addressService.updateById(addressId, data)))
      return c.json(
        this.respond(null, false, "Gagal memperbarui data alamat."),
        500
      );

    return c.json(
      this.respond(null, true, "Berhasil memperbarui data alamat.")
    );
  }

  // Delete address
  async delete(c: Context) {
    const params = c.req.param();
    const userId = parseInt(c.get("userId"));
    const addressId = parseInt(params.addressId);
    const content = { address_id: addressId, _user_id: userId };
    const validation = await deleteSchemaValidator.with(content).run();
    
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    if (!(await this.addressService.deleteById(addressId)))
      return c.json(
        this.respond(null, false, "Gagal menghapus data alamat."),
        500
      );

    return c.json(this.respond(null, false, "Berhasil menghapus data alamat."));
  }

  // set a address active
  async setActive(c: Context) {
    const params = c.req.param();
    const userId = c.get("userId");
    const addressId = parseInt(params.addressId);
    const content = { address_id: addressId, _user_id: userId };
    const validation = await setActiveSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
        return validation.sendError(c);

    if (!(await this.addressService.activeAddress(addressId)))
      return c.json(
        this.respond(null, false, "Tidak dapat mengaktifkan alamat."),
        500
      );

    return c.json(
      this.respond(null, true, "Berhasil mengaktifkan alamat."),
      500
    );
  }
}
