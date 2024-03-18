const isPositiveNumber = (num: number): boolean => {
  return num > 0;
}

export default class Battery {
  private capacityWh: number;
  private chargeWh: number;
  private degradationCount: number;
  
  constructor(capacityWh: number) {
    this.capacityWh = capacityWh;
    this.chargeWh = 0;
    this.degradationCount = 0;
  }

  // Accessors
  public getCurrentChargeWh(): number {
    return this.chargeWh;
  }
  public getCurrentChargePercentage(): number {
    return 100 * (this.chargeWh / this.capacityWh);
  }
  public getCapacityWh(): number {
    return this.capacityWh;
  }
  public getStatus(): string {
    if (this.chargeWh === 0) {
      return "EMPTY";
    } else if (this.chargeWh === this.capacityWh) {
      return "FULL";
    } else {
      return "PARTIALLY_CHARGED";
    }
  }

  // Mutators
  private handleDegradation(): void {
    if (this.chargeWh != 0) return 

    this.degradationCount += 1

    if (this.degradationCount === 3) {
      this.degradationCount = 0
      this.capacityWh *= 0.9
    }
  }
  public charge(Wh: number): void {
    if (!isPositiveNumber(Wh)) {
      throw new Error("cannot charge negative.");
    }

    this.chargeWh += Wh;

    if (this.chargeWh > this.capacityWh) {
      this.chargeWh = this.capacityWh;
    }
  }
  public discharge(Wh: number): void {
    if (!isPositiveNumber(Wh)) {
      throw new Error("cannot discharge negative.");
    }

    if (this.chargeWh - Wh < 0) {
      throw new Error("cannot discharge below 0.");
    }

    this.chargeWh -= Wh;

    this.handleDegradation();
  }

  
}