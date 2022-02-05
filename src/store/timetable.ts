import {
  Station,
  Train,
  StationType,
  TrainType,
  StationByNameRequest,
  StationByCodeRequest,
  StationData,
} from "@/types";
import { defineStore } from "pinia";
import axios, { AxiosResponse } from "axios";
import { irishRailApi } from "@/util/irishRail.api";
import { parseResponse } from "@/util/helpers";

export interface TimetableState {
  stations: Station[];
  trains: Train[];
  currentStation: null | Station;
  stationData: StationData[];
}

export const useTimetable = defineStore("timetable", {
  state: (): TimetableState => ({
    stations: [],
    trains: [],
    currentStation: null,
    stationData: [],
  }),
  actions: {
    async fetchStations(StationType?: StationType) {
      return axios
        .get(irishRailApi.allStationsURL, {
          params: {
            StationType,
          },
        })
        .then((r) => {
          this.stations = parseResponse<Station>(r.data, "ObjStation");
          return this.stations;
        });
    },
    async fetchCurrentTrains(TrainType?: TrainType) {
      return axios
        .get<string, AxiosResponse<string>>(irishRailApi.currentTrainsURL, {
          params: { TrainType },
        })
        .then((r) => {
          this.trains = parseResponse<Train>(r.data, "TrainPositions");
          return this.trains;
        });
    },
    async fetchStationByName(params: StationByNameRequest) {
      return axios
        .get<string, AxiosResponse<string>>(
          irishRailApi.fetchStationDataByNameURL,
          {
            params,
          }
        )
        .then((r) => {
          this.stationData = parseResponse<StationData>(
            r.data,
            "ObjStationData"
          );
        });
    },
    async fetchStationByCode(params: StationByCodeRequest) {
      return axios
        .get<string, AxiosResponse<string>>(
          irishRailApi.fetchStationDataByCodeURL,
          {
            params,
          }
        )
        .then((r) => {
          this.stationData = parseResponse<StationData>(
            r.data,
            "ObjStationData"
          );
        });
    },
  },
});
