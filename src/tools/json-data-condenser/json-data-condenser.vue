<script setup lang="ts">
import { ref } from 'vue';
import { condenseJsonStructures } from './json-data-condenser.service';

const rawJson = ref('');
const condensedJson = ref('');
const error = ref<string | null>(null);
const copySuccess = ref(false);
const preserveKeyOrder = ref(false);

function condense() {
  error.value = null;
  condensedJson.value = '';

  try {
    const parsed = JSON.parse(rawJson.value);
    const condensed = condenseJsonStructures(parsed, { preserveKeyOrder: preserveKeyOrder.value });

    condensedJson.value = JSON.stringify(condensed, null, 2);
  }
  catch (err: any) {
    error.value = 'Invalid JSON input. Please fix and try again.';
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(condensedJson.value);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 2000);
  }
  catch {
    error.value = 'Failed to copy to clipboard.';
  }
}
</script>

<template>
  <c-card title="JSON Condenser" class="mx-auto max-w-4xl px-4">
    <!-- Disclaimer Text -->
    <p class="mb-6 text-sm text-gray-700 leading-relaxed dark:text-gray-300">
      <strong>Disclaimer:</strong>
      This tool deduplicates arrays of objects based on their <strong>structure</strong>, not content.
      For example, <code>{ name: "Alice", id: 1 }</code> and <code>{ id: 1, name: "Alice" }</code>
      are considered <strong>identical</strong> because they share the same set of keys, regardless of order.
      Only one representative of each unique shape will be preserved, including in <strong>deeply nested arrays</strong>.
    </p>

    <div class="mb-4 flex items-center gap-2">
      <input id="key-order-checkbox" v-model="preserveKeyOrder" type="checkbox" class="accent-blue-600">
      <label for="key-order-checkbox" class="text-sm text-gray-700 dark:text-gray-300">
        Treat objects with the same keys but different order as different
      </label>
    </div>

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

      <div class="mt-4 flex">
        <c-button @click="copyToClipboard">
          {{ copySuccess ? 'Copied!' : 'Copy' }}
        </c-button>
      </div>
    </div>

    <!-- Error Display -->
    <c-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </c-alert>
  </c-card>
</template>
