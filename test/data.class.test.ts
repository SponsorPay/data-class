import {DataClass, dataClass} from "../src/data.class";
require('chai').should()

interface User extends DataClass<User> {
  name: string;
  age: number;
}

class User {
  constructor({age = 0, name = 'Guest'}: Partial<User> = {}) {
    Object.assign(this, {age, name});
  }
}

dataClass(User);

describe('data class', function () {
  it('should copy', () => {
    const user = new User();
    user.copy({name: 'Ben'}).name.should.eq('Ben');
    user.copy({name: 'Ben'}).age.should.eq(0);
    user.copy({name: 'Ben', age: 29}).age.should.eq(29);
  });
});
