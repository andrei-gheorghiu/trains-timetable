import { flushPromises, shallowMount } from "@vue/test-utils";
import TrainsTimetable from "@/components/TrainsTimetable.vue";
import { createTestingPinia, TestingPinia } from "@pinia/testing";
import axios from "../__mocks__/axios";
import { createPinia, getActivePinia, Pinia } from "pinia";
import { irishRailApi } from "../../src/util/irishRail.api";
import { readFileSync } from "fs";
import { useTimetable } from "../../src/store";
import { StationData } from "../../src/types";

describe("TrainsTimetable.vue", () => {
  let consoleSpy: any;
  let wrapper: any;
  const factory = (pinia: TestingPinia | Pinia = createTestingPinia()) =>
    shallowMount(TrainsTimetable, {
      global: {
        plugins: [pinia],
      },
    });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error");
    wrapper = factory();
  });

  afterEach(() => {
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should render without errors", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should start with Southbound direction", () => {
    expect(wrapper.vm.currentDirection).toEqual("Southbound");
  });

  it("should select Dublin Pearse station on mount, if available", async () => {
    expect(wrapper.vm.currentStation).toEqual(null);
    const store = createPinia();
    wrapper = factory(store);
    axios.mockResponse(
      {
        data: readFileSync(__dirname + "/../test-data/getAllStations.xml"),
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      },
      axios.lastReqGet()
    );
    await flushPromises();
    expect(wrapper.vm.currentStation).toEqual({
      stationAlias: "Pearse",
      stationCode: "PERSE",
      stationDesc: "Dublin Pearse",
      stationId: 150,
      stationLatitude: 53.3433,
      stationLongitude: -6.24829,
    });
  });
  it("it should request station data", async () => {
    const store = createPinia();
    wrapper = factory(store);
    axios.mockResponse(
      {
        data: readFileSync(__dirname + "/../test-data/getAllStations.xml"),
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      },
      axios.lastReqGet()
    );
    await flushPromises();
    expect(axios.lastReqGet().config).toEqual({
      params: { StationCode: "PERSE" },
      data: {},
      method: "get",
      url: irishRailApi.fetchStationDataByCodeURL,
    });
    axios.mockResponse(
      {
        data: readFileSync(
          __dirname + "/../test-data/getStationDataByCode.xml"
        ),
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      },
      axios.lastReqGet()
    );
    await flushPromises();
    expect(wrapper.vm.stationData).toEqual(
      JSON.parse(
        readFileSync(__dirname + "/../test-data/stationData.json").toString()
      )
    );
  });
  it("should filter station data by direction", async () => {
    const pinia = getActivePinia();
    const tt = useTimetable(pinia);
    const stationData = JSON.parse(
      readFileSync(__dirname + "/../test-data/stationData.json").toString()
    );
    Object.assign(tt, { stationData });
    expect(wrapper.vm.currentDirection).toEqual("Southbound");
    expect(wrapper.vm.filteredStationData).toEqual(
      stationData.filter((sd: StationData) => sd.direction === "Southbound")
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll("tbody tr").length).toBe(4);
    wrapper.vm.currentDirection = "Northbound";
    expect(wrapper.vm.filteredStationData).toEqual(
      stationData.filter((sd: StationData) => sd.direction === "Northbound")
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll("tbody tr").length).toBe(3);
  });
});
