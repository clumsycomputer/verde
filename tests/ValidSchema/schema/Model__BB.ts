export interface Model__BB
  extends Model__CC, Model__DD<Model__BB, number> {}

export interface Model__CC {
  ccProperty__AA: Model__BB;
}

export interface Model__DD<
  DdParameter__AA,
  DdParameter__BB extends number,
  DdParameter__CC = string,
> extends Model__EE<DdParameter__CC, Model__BB> {  
  ddProperty__AA: DdParameter__AA;
  ddProperty__BB: DdParameter__BB;
}

export interface Model__EE<EeParameter__AA, EeParameter__BB> {
  eeProperty__AA: EeParameter__AA;
  eeProperty__BB: EeParameter__BB;
}