<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { decompress } from './gzip-decompressor.service';

const router = useRouter();

const userInput = ref('');
const decompressedOutput = ref('');
const error = ref<string | null>(null);

function clearAll() {
  userInput.value = '';
  decompressedOutput.value = '';
  error.value = null;
}

function goToJsonPrettify() {
  router.push({
    path: '/json-prettify',
    state: {
      json: decompressedOutput.value,
    },
  });
}

watch(userInput, async (val) => {
  error.value = null;
  decompressedOutput.value = '';

  if (!val.trim()) {
    return;
  }

  try {
    decompressedOutput.value = await decompress(val);
  }
  catch (err: any) {
    error.value = 'Decompression failed. Please ensure the input is valid GZip.';
  }
});
</script>

<template>
  <c-card title="GZip Decompressor">
    <div class="mb-2">
      GZipped User Input
    </div>
    <c-input-text
      v-model:value="userInput"
      placeholder="Paste your GZipped string here..."
      rows="6"
      class="mb-6"
      multiline raw-text monospace overflow-y-auto
    />

    <c-alert v-if="error" type="error" title="Error while decompressing" class="mt-4">
      {{ error }}
    </c-alert>

    <div class="mb-2 mt-2">
      Decompressed Output
    </div>
    <c-input-text
      :value="decompressedOutput"
      placeholder="Decompressed result will appear here..."
      rows="12"
      readonly multiline monospace overflow-y-auto
    />

    <div class="mt-8 flex justify-center gap-3">
      <c-button @click="clearAll">
        Clear
      </c-button>
      <c-button @click="goToJsonPrettify">
        Json Prettify
      </c-button>
    </div>
  </c-card>
</template>
