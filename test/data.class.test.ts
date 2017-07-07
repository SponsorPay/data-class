import {DataClass, dataClass} from "../src/data.class"
import chai = require("chai")
chai.should();

interface User extends DataClass<User> {
  name: string
  age: number
}

class User {
  constructor({name = "Guest", age = 0}: Partial<User> = {}) {
    Object.assign(this, {name, age});
  }
}

dataClass(User);

describe("data class", function () {
  this.timeout(1000);
  it("should copy", () => {
    const user = new User();
    user.copy({name: "Ben"}).name.should.eq("Ben");
    user.copy({name: "Ben"}).age.should.eq(0);
    user.copy({name: "Ben", age: 29}).age.should.eq(29);
    (user === user.copy()).should.eq(false);
    user.name.should.eq("Guest");
    user.age.should.eq(0);
  });
});
