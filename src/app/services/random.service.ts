import { Injectable } from '@angular/core'

export abstract class RandomService {
  abstract random(): number
}

export class RandomServiceImplementation extends RandomService {
  random(): number {
    return Math.random()
  }
}