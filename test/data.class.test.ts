import {DataClass, dataClass} from "../src"
import chai = require("chai")

chai.should();

interface UserParams {
  name: string
  age: number
}

interface User extends UserParams, DataClass {

}

class User {
  static EMPTY = new User({
    age: 0,
    name: "Guest",
  })

  constructor(params: UserParams) {
    Object.assign(this, params)
  }
}

interface AwesomeUserParams extends UserParams {
  awesomeness: number;
}

interface AwesomeUser extends AwesomeUserParams, User {

}

class AwesomeUser extends User {
  static EMPTY = new AwesomeUser({
    age: 0,
    name: "Awesome Guest",
    awesomeness: 10
  })

  constructor(params: AwesomeUserParams) {
    super(params)
    Object.assign(this, params)
  }
}

dataClass(User);

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
    const upgraded = a.copy({
      awesomeness: a.awesomeness + 1
    })
    a.awesomeness.should.eq(10)
    upgraded.awesomeness.should.eq(11)
    upgraded.should.be.instanceOf(AwesomeUser)
  })
});
