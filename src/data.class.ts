export interface DataClass {
  copy(newValue?: Partial<this>): this;

  mutate(newValue?: Partial<this>): this;
}

export type Constructor<T = {}> = new (...args: any[]) => T;

function copy<T>(newValue: Partial<T> = {}): T {
  const changes: any = {}
  for (const p of Object.keys(this)) {
    const value = (newValue as any)[p]
    changes[p] = value === void 0 ? this[p] : value
  }
  return new this.constructor(changes)
}

function mutate<T>(newValue: Partial<T> = {}): T {
  for (const p of Object.keys(this)) {
    const value = (newValue as any)[p]
    if (value !== void 0) {
      this[p] = value
    }
  }
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
