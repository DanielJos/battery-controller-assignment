# Sunsave Assignment - Battery Controller
This is the repository for the coding assignment I completed for Sunsave. The task was to build a simple battery controller using either JS or TS. The task is detailed below. All that follows is the solution I provided for the task.

___

Node version: v18.12.0

# Run Instructions
- Install package with `npm i`
- Test with `npm test`. 

# Task
Build a simple battery controller using either JS or TS. It might look something like:

```js
const battery = new Battery();

battery.getCapacity();
// 4000

battery.charge(4000);

battery.discharge(5000);
// Error: Cannot discharge current charge

battery.discharge(1000);

battery.getCurrentCharge();
// 3000

battery.getStatus();
// "PARTIALLY_CHARGED"
// Could also be "FULLY_CHARGED", "EMPTY" etc.
```

## Functional Requirements
1. 4kW capacity (but should support +/-).
2. Can accept more charge than it's capacity, but can only store 100%.
3. Cannot discharge more than it's capacity at time of discharge.
4. For every 3 complete discharges (<=0% filled), the capacity cumulatively drops by 10%.

## Assumptions
1. The battery will start empty. Initialising an empty battery then giving it charge feels more natural than vice versa.
2. Capacity should be a measure of energy - kWh (kilo Watt hours) or J (Joules) - rather than power (kW).
3. Each degradation will amount to 10% of current capacity not original capacity. I would presume a real battery would have this inverse exponential degradation.
4. There is only one type of battery, each battery behaves the same (the same degradation characteristics). Else, we could define a parent Battery and LiBattery, AcidBattery, etc children with different degradation characteristics. This would be cool, but overkill (and not in the req).

# Thoughts
Starting by defining the signature and then tests to be TDD-ish.

```ts
export default class Battery {
  private capacityWh: number;
  private chargeWh: number;
  private degradationCount: number;
  
  constructor(capacityWh: number) {
    this.capacityWh = capacityWh;
    this.chargeWh = 0;
  }

  public getCurrentChargeWh(): number {
    // ..
  }
  public getCurrentChargePercentage(): number {
    // ..
  }

  public getCapacity(): number {
    // ..
  }
  public getStatus(): string {
    // ..
  }

  public charge(Wh: number): void {
    // ..
  }
  public discharge(Wh: number): void {
    // ..
  }
}
```

Given assumption 3, we do not need to store the number of degradations, the following degradation is a function of only the current state (newCap = oldCap * 0.9).

## Tests
See tests/Battery.tests.ts