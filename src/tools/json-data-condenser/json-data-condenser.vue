<script setup lang="ts">
import { ref } from 'vue';
import { condenseJsonStructures } from './json-data-condenser.service';

const rawJson = ref('');
const condensedJson = ref('');
const error = ref<string | null>(null);

function condense() {
  error.value = null;
  condensedJson.value = '';

  try {
    const parsed = JSON.parse(rawJson.value);
    const condensed = condenseJsonStructures(parsed);
    condensedJson.value = JSON.stringify(condensed, null, 2);
  }
  catch (err: any) {
    error.value = 'Invalid JSON input. Please fix and try again.';
  }
}
</script>

<template>
  <c-card title="JSON Condenser" class="mx-auto max-w-4xl px-4">
    <!-- Input -->
    <div class="mb-2 font-semibold">
      Original JSON Input
    </div>
    <c-input-text
      v-model:value="rawJson"
      placeholder="Paste a JSON payload here..."
      class="mb-4"
      rows="12"
      multiline
      raw-text
      monospace
    />
    <c-button @click="condense">
      Condense JSON
    </c-button>

    <!-- Output Section -->
    <div class="mt-10">
      <div class="mb-2 font-semibold">
        Condensed Output
      </div>
      <c-input-text
        :value="condensedJson"
        placeholder="Condensed JSON will appear here..."
        rows="12"
        readonly multiline monospace raw-text
      />
    </div>

    <!-- Error Display -->
    <c-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </c-alert>
  </c-card>
</template>
