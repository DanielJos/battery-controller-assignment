import Battery from '../src/index';

describe('Battery', () => {
  let battery: Battery;
 
  // 1. 4kW capacity (but should support +/-)
  test("should be created with capacity of 4000", ()=>{
    battery = new Battery(4000)
    
    expect(battery.getCapacityWh()).toBe(4000)
    expect(battery.getCurrentChargeWh()).toBe(0)
  })

  // 2. Can accept more charge than it's capacity, but can only store 100%
  test("should accept any charge, but only store up to 100% capacity", () => {
    battery = new Battery(4000)

    battery.charge(500)
    expect(battery.getCurrentChargeWh()).toBe(500)

    battery.charge(5000)
    expect(battery.getCapacityWh()).toBe(4000)
  })

  // 3. Cannot discharge more than it's capacity at time of discharge.
  test("should not discharge below cap", () => {
    battery = new Battery(4000)
    battery.charge(4000)

    expect(() => battery.discharge(5000)).toThrow("cannot discharge below 0.")
  })

  // 4. For every 3 complete discharge (<=0% filled), the capacity cumulatively drops by 10%.
  test("should degrade", () => {
    battery = new Battery(4000)
    
    battery.charge(4000)
    battery.discharge(4000)

    expect(battery.getCapacityWh()).toBe(4000)

    battery.charge(4000)
    battery.discharge(4000)
    
    expect(battery.getCapacityWh()).toBe(4000)

    battery.charge(4000)
    battery.discharge(4000)

    expect(battery.getCapacityWh()).toBe(3600) // should degrade

    battery.charge(4000)
    battery.discharge(3600)

    expect(battery.getCapacityWh()).toBe(3600)

    battery.charge(4000)
    battery.discharge(3600)

    expect(battery.getCapacityWh()).toBe(3600)

    battery.charge(4000)
    battery.discharge(3600)

    expect(battery.getCapacityWh()).toBe(3240) // should degrade
    
    battery.charge(4000)
    battery.discharge(3240)

    expect(battery.getCapacityWh()).toBe(3240)

    battery.charge(4000)
    battery.discharge(3240)

    expect(battery.getCapacityWh()).toBe(3240)

    battery.charge(4000)
    battery.discharge(3240)

    expect(battery.getCapacityWh()).toBe(2916) // should degrade

    battery.charge(4000)
    battery.discharge(2916)

    expect(battery.getCapacityWh()).toBe(2916)

    battery.charge(4000)
    battery.discharge(2816)
    battery.discharge(100)

    expect(battery.getCapacityWh()).toBe(2916)

    battery.charge(4000)
    battery.discharge(2816)
    battery.discharge(100)

    expect(battery.getCapacityWh()).toBe(2624.4) // should degrade
  })

  // // Other
  test("should start empty", () => {
    battery = new Battery(4000)

    expect(battery.getCurrentChargePercentage()).toBe(0)
  })

  test("should return status", () => {
    battery = new Battery(4000)

    expect(battery.getStatus()).toBe("EMPTY")

    battery.charge(4000)
    expect(battery.getStatus()).toBe("FULL")

    battery.discharge(2000)
    expect(battery.getStatus()).toBe("PARTIALLY_CHARGED")
  })

  test("should return charge percentage", () => {
    battery = new Battery(4000)

    expect(battery.getCurrentChargePercentage()).toBe(0)

    battery.charge(4000)
    expect(battery.getCurrentChargePercentage()).toBe(100)

    battery.discharge(2000)
    expect(battery.getCurrentChargePercentage()).toBe(50)

    // Single degradation
    battery.charge(4000)
    battery.discharge(4000)

    battery.charge(4000)
    battery.discharge(4000)

    battery.charge(4000)
    battery.discharge(4000)

    // Should be 100 * 500/3600
    battery.charge(500)
    expect(battery.getCurrentChargePercentage()).toBeCloseTo(13.88888888888889, 7)
  })

  test("should not degrade when not empty", () => {
    battery = new Battery(4000)

    battery.charge(4000)
    battery.discharge(2000)

    expect(battery.getCapacityWh()).toBe(4000)

    battery.charge(4000)
    battery.discharge(2000)

    expect(battery.getCapacityWh()).toBe(4000)
  })

  test("should not except negative charge", () => {
    battery = new Battery(4000)

    expect(() => battery.charge(-500)).toThrow("cannot charge negative.")
  })

  test("should not except negative discharge", () => {
    battery = new Battery(4000)

    expect(() => battery.discharge(-500)).toThrow("cannot discharge negative.")
  })
})