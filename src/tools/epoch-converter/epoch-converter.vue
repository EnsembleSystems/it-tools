<script setup lang="ts">
import { ref } from 'vue';
import { type DateParts, dateToEpoch, epochToDate, getISODateString } from './epoch-converter.service';

const epochInput = ref('');
const dateOutput = ref<{ local: string; utc: string } | null>(null);
const epochOutput = ref('');
const error = ref<string | null>(null);

const epochInputError = ref<string | null>(null);
const dateInputError = ref<string | null>(null);

const dateParts = ref<DateParts>({
  year: '',
  month: '',
  day: '',
  hour: '',
  minute: '',
  second: '',
});

/**
 * Converts a Unix epoch timestamp to human-readable date strings
 * Accepts seconds (10-digit) or milliseconds (13-digit)
 */
function convertEpochToDate() {
  error.value = null;
  try {
    dateOutput.value = epochToDate(epochInput.value);
  }
  catch (e: any) {
    epochInputError.value = e.message;
  }
}

/**
 * Converts a Unix epoch timestamp to human-readable date strings
 * Accepts seconds (10-digit) or milliseconds (13-digit)
 */
function convertDateToEpochLocal() {
  try {
    validateDateParts(dateParts.value);
    const isoString = getISODateString(dateParts.value);
    epochOutput.value = dateToEpoch(isoString).toString();
    dateInputError.value = null;
  }
  catch (e: any) {
    epochOutput.value = '';
    dateInputError.value = e.message;
  }
}

/**
 * Converts UTC date string parts to epoch (seconds)
 */
function convertDateToEpochUTC() {
  try {
    validateDateParts(dateParts.value);
    const isoString = getISODateString(dateParts.value);
    epochOutput.value = dateToEpoch(isoString, { parseAsUTC: true }).toString();
    dateInputError.value = null;
  }
  catch (e: any) {
    epochOutput.value = '';
    dateInputError.value = e.message;
  }
}

function validateDateParts(parts: DateParts): void {
  const { year, month, day, hour, minute, second } = parts;

  if (!/^\d{4}$/.test(year)) {
    throw new Error('Year must be 4 digits');
  }
  if (+month < 1 || +month > 12) {
    throw new Error('Month must be between 1 and 12');
  }
  if (+day < 1 || +day > 31) {
    throw new Error('Day must be between 1 and 31');
  }
  if (+hour < 0 || +hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }
  if (+minute < 0 || +minute > 59) {
    throw new Error('Minute must be between 0 and 59');
  }
  if (+second < 0 || +second > 59) {
    throw new Error('Second must be between 0 and 59');
  }

  // Cross-check full date validity
  const y = +year;
  const m = +month - 1;
  const d = +day;

  const constructed = new Date(y, m, d);

  if (constructed.getUTCFullYear() !== y || constructed.getUTCMonth() !== m || constructed.getUTCDate() !== d) {
    throw new TypeError('Invalid date string');
  }
}

// Clear errors on input
watch(epochInput, () => {
  epochInputError.value = null;
});

watch(dateParts, () => {
  dateInputError.value = null;
}, { deep: true });
</script>

<template>
  <c-card title="Epoch Time Converter (24 hour time format)" class="mx-auto max-w-4xl px-4">
    <!-- Epoch to Date -->
    <div class="mb-8">
      <div class="mb-2 font-semibold">
        Epoch to Date
      </div>

      <div class="mb-2 text-xs text-neutral-400">
        Epoch is interpreted as:
        <ul class="mt-1 list-disc pl-4">
          <li><strong>10 digits</strong> → seconds (e.g. <code>1718822594</code>)</li>
          <li><strong>13 digits</strong> → milliseconds (e.g. <code>1718822594000</code>)</li>
        </ul>
        Epoch values outside supported JavaScript range (±8.64e15) may result in invalid dates.
      </div>

      <c-input-text
        v-model:value="epochInput"
        placeholder="Enter epoch timestamp (e.g. 1718822594)"
        class="mb-4"
        raw-text
      />
      <c-button @click="convertEpochToDate">
        Convert to Date
      </c-button>

      <div v-if="dateOutput" class="mt-4 text-sm text-green-400 space-y-1">
        <div>Local Time: <strong>{{ dateOutput.local }}</strong></div>
        <div>GMT (UTC): <strong>{{ dateOutput.utc }}</strong></div>
      </div>
    </div>

    <c-alert v-if="epochInputError" type="error" class="mb-4 mt-4">
      {{ epochInputError }}
    </c-alert>

    <!-- Date to Epoch -->
    <div class="mb-8">
      <div class="mb-2 font-semibold">
        Date to Epoch
      </div>

      <div class="mb-4 max-w-sm space-y-3">
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium">Year:</label>
          <c-input-text v-model:value="dateParts.year" placeholder="YYYY" class="ml-auto w-32" />
        </div>
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium">Month:</label>
          <c-input-text v-model:value="dateParts.month" placeholder="MM" class="ml-auto w-24" />
        </div>
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium">Day:</label>
          <c-input-text v-model:value="dateParts.day" placeholder="DD" class="ml-auto w-24" />
        </div>
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium">Hour:</label>
          <c-input-text v-model:value="dateParts.hour" placeholder="HH" class="ml-auto w-24" />
        </div>
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium">Minute:</label>
          <c-input-text v-model:value="dateParts.minute" placeholder="MM" class="ml-auto w-24" />
        </div>
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium">Second:</label>
          <c-input-text v-model:value="dateParts.second" placeholder="SS" class="ml-auto w-24" />
        </div>
      </div>

      <div class="mt-2 flex gap-4">
        <c-button @click="convertDateToEpochLocal">
          Convert to Epoch (Local)
        </c-button>
        <c-button @click="convertDateToEpochUTC">
          Convert to Epoch (UTC)
        </c-button>
      </div>

      <div v-if="epochOutput" class="mt-4 text-sm text-green-400">
        Epoch Timestamp: <strong>{{ epochOutput }}</strong>
      </div>
    </div>

    <c-alert v-if="dateInputError" type="error" class="validateError mb-4 mt-4">
      {{ dateInputError }}
    </c-alert>
  </c-card>
</template>
