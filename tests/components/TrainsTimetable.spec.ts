import { shallowMount } from "@vue/test-utils";
import TrainsTimetable from "@/components/TrainsTimetable.vue";
import { createTestingPinia } from "@pinia/testing";

describe("TrainsTimetable.vue", () => {
  let consoleSpy: any;
  let wrapper: any;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "error");
    wrapper = shallowMount(TrainsTimetable, {
      global: {
        plugins: [createTestingPinia()],
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
