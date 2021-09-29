<template>
  <fingerprint-spinner
  :animation-duration="1500"
  :size="64"
  color="#7c3aed"
/>
</template>

<script>
import { FingerprintSpinner } from 'epic-spinners'

export default {
  components: {
    FingerprintSpinner
  }
}
</script>
