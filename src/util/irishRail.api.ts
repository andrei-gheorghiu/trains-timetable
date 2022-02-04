export const irishRailApi = {
  prefix(s = ""): string {
    return `https://justcors.com/l_1ve8kxkto7/http://api.irishrail.ie/realtime/realtime.asmx/${s}`;
  },
  get baseURL(): string {
    return this.prefix();
  },
  get allStationsURL(): string {
    return this.prefix("getAllStationsXML");
  },
  get currentTrainsURL(): string {
    return this.prefix("getCurrentTrainsXML");
  },
  get fetchStationDataByNameURL(): string {
    return this.prefix("getStationDataByNameXML");
  },
  get fetchStationDataByCodeURL(): string {
    return this.prefix("getStationDataByCodeXML");
  },
};
