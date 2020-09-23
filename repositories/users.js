const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
const Repository = require("./repository");

class UsersRepository extends Repository {
  async createUser(attr) {
    attr.id = this.getRandomId();

    const salt = crypto.randomBytes(8).toString("hex");

    const hashed = await scrypt(attr.password, salt, 64);

    const records = await this.getAll();

    const record = { ...attr, password: `${hashed.toString("hex")}.${salt}` };

    records.push(record);

    await this.writeAll(records);
    return record;
  }

  async comparePassword(saved, supplied) {
    const [hashed, salt] = saved.split(".");
    const suppliedHash = await scrypt(supplied, salt, 64);
    return hashed === suppliedHash.toString("hex");
  }
}
module.exports = new UsersRepository("users.json");
