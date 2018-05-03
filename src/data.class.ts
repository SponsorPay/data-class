export interface DataClass<T> {
  copy(newValue?: Partial<T>): this;

  mutate(newValue?: Partial<T>): this;
}

export type Constructor<T> = new (...args: any[]) => T;

function copy<T>(this: T, newValue?: Partial<T>): T {
  const newInstance = new (this.constructor as Constructor<T>)(this)
  if (newValue == null) {
    return newInstance
  }
  Object.assign(newInstance, newValue)
  return newInstance
}

function mutate<T>(this: T, newValue?: Partial<T>): T {
  if (newValue == null) {
    return this
  }
  Object.assign(this, newValue)
  return this
}

export function dataClass<T>(ctor: Constructor<T>) {
  const ctorProto = ctor.prototype as any
  if (ctorProto.copy) {
    console.warn(`dataClass: copy is already defined on prototype of provided constructor "${(ctor as any).name}"`)
  }
  if (ctorProto.mutate) {
    console.warn(`dataClass: mutate is already defined on prototype of provided constructor "${(ctor as any).name}"`)
  }
  ctorProto.copy = copy;
  ctorProto.mutate = mutate;
}
