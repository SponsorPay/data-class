import {DataClass, dataClass} from "../src"
import chai = require("chai")

chai.should();

interface UserParams {
  name: string
  age: number
}

interface User extends UserParams, DataClass<UserParams> {

}

class User {
  static EMPTY = new User({
    age: 0,
    name: "Guest",
  })

  constructor(params: UserParams) {
    Object.assign(this, params)
  }

  changeName(name: string) {
    return this.copy({
      name
    })
  }

  passport() {
    return `Age: ${this.age}, Name: ${this.name}`
  }
}

dataClass(User);


interface AwesomeUserParams extends UserParams {
  awesomeness: number;
}

interface AwesomeUser extends AwesomeUserParams, User, DataClass<AwesomeUserParams> {
  copy(newValue?: Partial<AwesomeUserParams>): this;
  mutate(newValue?: Partial<AwesomeUserParams>): this;
}

class AwesomeUser {
  static EMPTY = new AwesomeUser({
    age: 0,
    name: "Awesome Guest",
    awesomeness: 10
  })

  constructor(params: AwesomeUserParams) {
    Object.assign(this, params)
  }
}
(AwesomeUser.prototype as any).changeName = User.prototype.changeName

dataClass(AwesomeUser);


describe("data class", function () {
  this.timeout(1000);
  it("should copy", () => {
    const user = User.EMPTY
    user.copy({name: "Ben"}).name.should.eq("Ben");
    user.copy({name: "Ben"}).age.should.eq(0);
    user.copy({name: "Ben", age: 29}).age.should.eq(29);
    (user === user.copy()).should.eq(false);
    user.name.should.eq("Guest");
    user.age.should.eq(0);
    user.copy({name: "Ben"}).should.be.instanceOf(User)
  });

  it("should mutate", () => {
    const user = User.EMPTY.copy()
    const mutatedUser = user.mutate({name: "Ben"});
    (mutatedUser === user).should.be.true;
    mutatedUser.name.should.eq("Ben");
  })

  it("infers copy correctly on sub-class", () => {
    const a = AwesomeUser.EMPTY
    const derived = a.changeName("agsgs").copy({
      awesomeness: 8
    })
    derived.awesomeness.should.eq(8)
    derived.name.should.eq("agsgs")
    const upgraded = a.copy({
      awesomeness: a.awesomeness + 1
    })
    a.awesomeness.should.eq(10)
    upgraded.awesomeness.should.eq(11)
    upgraded.should.be.instanceOf(AwesomeUser)
  })
});
