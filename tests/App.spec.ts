import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import { createTestingPinia } from "@pinia/testing";
import axios from "axios";
import VueAxios from "vue-axios";

describe("TrainsTimetable.vue", () => {
  let consoleSpy: any;
  let wrapper: any;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error");
    wrapper = shallowMount(App, {
      global: {
        plugins: [createTestingPinia(), [VueAxios, axios]],
      },
    });
  });

  afterEach(() => {
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should render without errors", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
