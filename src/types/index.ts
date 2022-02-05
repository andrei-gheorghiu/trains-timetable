export interface Train {
  trainStatus: string;
  trainLatitude: string;
  trainLongitude: string;
  trainCode: string;
  trainDate: string;
  publicMessage: string;
  direction: string;
}

export interface Station {
  stationDesc: string;
  stationCode: string;
  stationId: string;
  stationAlias: string;
  stationLatitude: string;
  stationLongitude: string;
}

export type StationType = "A" | "M" | "S" | "D";
export type TrainType = "A" | "M" | "S" | "D";
export type LocationType = "O" | "D" | "S";

export interface StationByNameRequest {
  StationDesc: string;
  NumMins?: number;
}

export interface StationByCodeRequest {
  StationCode: string;
  NumMins?: number;
}

export interface StationData {
  servertime: string;
  traincode: string;
  stationfullname: string;
  stationcode: string;
  querytime: string;
  traindate: string;
  origin: string;
  destination: string;
  origintime: string;
  destinationtime: string;
  status: string;
  lastlocation: string;
  duein: string;
  late: string;
  exparrival: string;
  expdepart: string;
  scharrival: string;
  schdepart: string;
  direction: string;
  traintype: TrainType;
  locationtype: LocationType;
}
