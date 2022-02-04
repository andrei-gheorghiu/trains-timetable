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
  serverTime: string;
  trainCode: string;
  stationFullName: string;
  stationCode: string;
  queryTime: string;
  trainDate: string;
  origin: string;
  destination: string;
  originTime: string;
  destinationTime: string;
  status: string;
  lastLocation: string;
  duein: string;
  late: string;
  expArrival: string;
  expDepart: string;
  schArrival: string;
  schDepart: string;
  direction: string;
  trainType: TrainType;
  locationType: LocationType;
}
