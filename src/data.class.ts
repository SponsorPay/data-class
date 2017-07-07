export interface DataClass<T> {
  copy(newValue?: Partial<T>): T
}

export type Constructor<T = {}> = new (...args: any[]) => T;

function copy<T>(newValue: Partial<T>): T {
  return new this.constructor({...this, ...newValue as any})
}

export function dataClass<T>(ctor: Constructor<T>) {
  if (ctor.prototype.copy) {
    console.warn(`dataClass: copy is already defined on prototype of provided constructor "${(ctor as any).name}"`)
  }
  ctor.prototype.copy = copy;
}
