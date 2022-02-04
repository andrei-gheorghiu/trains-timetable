<template>
  <div class="container">
    <div class="form-wrapper">
      <v-select
        v-model="currentStation"
        :get-option-label="getStationLabel"
        :options="stations"
      ></v-select>
      <v-select
        v-model="currentDirection"
        :reduce="reduceDirection"
        :options="directions"
      ></v-select>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Destination</th>
            <th>Direction</th>
            <th>Due in</th>
          </tr>
        </thead>
        <tbody v-if="filteredStationData.length">
          <tr v-for="(record, key) in filteredStationData" :key="key">
            <td v-text="key + 1" />
            <td v-text="record.destination" />
            <td v-text="record.direction" />
            <td v-text="humanizeMinutes(+record.duein)" />
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4">
              <div class="no-data">
                {{
                  currentStation
                    ? "No trains"
                    : "You haven't selected a station."
                }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card d-flex space-between">
      <div class="small">
        Last updated:
        <code>{{ currentStation ? counter.val.toFixed(1) : "--" }}s</code> ago.
      </div>
      <div class="small">
        Next update: in
        <code>{{ currentStation ? (20 - counter.val).toFixed(1) : "--" }}s</code
        >.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  watch,
} from "vue";
import vSelect from "vue-select";
import { useTimetable } from "@/store";
import { Station, StationData, Train } from "@/types";
import { baseDirections } from "@/util/helpers";
import gsap, { Power0 } from "gsap";
import humanize from "humanize-duration";

interface TrainsTimetableState {
  trains: Train[];
  stations: Station[];
  currentStation: Station | null;
  stationData: StationData[];
  filteredStationData: StationData[];
  directions: { label: string; value: string }[];
  currentDirection: string;
  counter: { val: number };
}

interface GenericOption {
  label: string;
  value: unknown;
}

export default defineComponent({
  name: "TrainsTimetable",
  components: {
    vSelect,
  },
  setup() {
    const tt = useTimetable();
    onMounted(async () => {
      await tt.fetchStations();
      tt.currentStation =
        tt.stations.find((st) => st.stationDesc === "Dublin Pearse") || null;
    });
    const state: TrainsTimetableState = reactive({
      trains: computed(() => tt.trains),
      stations: computed(() => tt.stations),
      currentStation: computed({
        get(): Station | null {
          return tt.currentStation;
        },
        set(val: Station | null) {
          tt.currentStation = val;
        },
      }),
      stationData: computed(() => tt.stationData),
      filteredStationData: computed(() =>
        tt.stationData
          .filter(
            (sd) =>
              !state.currentDirection || state.currentDirection === sd.direction
          )
          .sort((a, b) => (+a.duein > +b.duein ? 1 : -1))
      ),
      directions: computed(() =>
        [
          ...new Set([
            ...baseDirections,
            ...tt.stationData.map((t) => t.direction),
          ]),
        ].map((label) => ({ label, value: label }))
      ),
      currentDirection: "Southbound",
      counter: { val: 0 },
    });
    let tween: gsap.core.Tween;
    const iteration = () => {
      tween = gsap.fromTo(
        state.counter,
        { val: 0, decimals: 0 },
        {
          val: 20,
          duration: 20,
          ease: Power0.easeNone,
          onComplete: updateStation,
        }
      );
    };
    const updateStation = () => {
      tween?.kill();
      if (tt.currentStation?.stationCode) {
        tt.fetchStationByCode({
          StationCode: tt.currentStation.stationCode,
        }).then(iteration);
      } else {
        tt.stationData = [];
      }
    };
    const getStationLabel = (item: Station) => item.stationDesc;
    const humanizeMinutes = (n: number) => humanize(n * 6e4);
    const reduceDirection = (item: GenericOption) => item.value;
    watch(() => state.currentStation, updateStation);
    return {
      humanizeMinutes,
      reduceDirection,
      getStationLabel,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  max-width: 1000px;
}
.form-wrapper {
  display: flex;
  align-items: center;
  > * {
    flex: 1 0 0;
    margin: 0 0.5rem;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.small {
  font-family: monospace;
  font-size: 1rem;
  code {
    color: #ffd114;
  }
}
table {
  width: 100%;
  th {
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.42);
    &:first-child {
      width: 30px;
    }
  }
  .no-data {
    padding: 5rem;
    display: flex;
    justify-content: center;
    font-style: italic;
  }
  td,
  th {
    padding: 3px 7px;
  }
}
.d-flex {
  display: flex;
}
.space-between {
  justify-content: space-between;
}
</style>
