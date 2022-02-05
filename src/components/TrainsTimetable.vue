<template>
  <div class="container">
    <div class="form-wrapper">
      <v-select
        v-model="currentStation"
        :get-option-label="getStationLabel"
        :options="stations"
        placeholder="Select a station..."
      ></v-select>
      <v-select
        v-model="currentDirection"
        :reduce="reduceDirection"
        :options="directions"
        placeholder="Select a direction..."
      ></v-select>
    </div>
    <div class="card table-wrapper">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Destination</th>
            <th>Direction</th>
            <th>Due in</th>
            <th>Delay</th>
          </tr>
        </thead>
        <tbody v-if="filteredStationData.length">
          <tr v-for="(record, key) in filteredStationData" :key="key">
            <td v-text="key + 1" />
            <td v-text="record.destination" />
            <td v-text="record.direction" />
            <td>
              <span
                v-if="humanizeMinutes(+record.duein)"
                v-text="humanizeMinutes(+record.duein)"
              />
              <span v-else>0 m</span>
            </td>
            <td>
              <span
                v-if="humanizeMinutes(+record.late)"
                v-text="humanizeMinutes(+record.late)"
              />
              <code v-else>--</code>
            </td>
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
import { baseDirections, englishHumanizer } from "@/util/helpers";
import gsap, { Power0 } from "gsap";

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
        { val: 0 },
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
    const humanizeMinutes = (n: number) =>
      (n >= 0 ? "" : "-") + (n === 0 ? "" : englishHumanizer(n * 6e4));
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
@import "../style/mixins";
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
  @media (max-width: 768px) {
    flex-direction: column;
    > * {
      width: 100%;
      margin: 1rem 0 0.5rem;
    }
  }
  :deep(.vs__actions) {
    padding: 4px 12px 0 12px;
  }
  :deep(.vs__selected),
  :deep(.vs__search) {
    padding-left: 12px;
  }
}
code {
  color: rgba(255, 255, 255, 0.42);
}
:deep(input::placeholder) {
  font-style: italic;
  color: rgba(255, 255, 255, 0.65);
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
.table-wrapper {
  overflow-x: auto;
  @include make-scrollable;
  table {
    min-width: 500px;
  }
}
.d-flex {
  display: flex;
}
.space-between {
  justify-content: space-between;
}
</style>
