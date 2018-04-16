export interface DataClass<T> {
  copy(newValue?: Partial<T>): this;

  mutate(newValue?: Partial<T>): this;
}

export type Constructor<T> = new (...args: any[]) => T;

function copy<T>(this: T, newValue: Partial<T> = {}): T {
  const changes: any = {}
  for (const p of Object.keys(this) as (keyof T)[]) {
    const value = newValue[p]
    changes[p] = value === void 0 ? this[p] : value
  }
  return new (this.constructor as Constructor<T>)(changes)
}

function mutate<T>(this: T, newValue: Partial<T> = {}): T {
  for (const p of Object.keys(this) as (keyof T)[]) {
    const value = newValue[p]
    if (value !== void 0) {
      this[p] = value as T[keyof T]
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
