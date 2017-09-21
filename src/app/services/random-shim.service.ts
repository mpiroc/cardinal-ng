import { Injectable } from '@angular/core'

export abstract class RandomShimService {
  abstract random(): number
}

@Injectable()
export class RandomShimServiceImplementation extends RandomShimService {
  random(): number {
    return Math.random()
  }
}
