<template>
  <v-container>
    <v-row v-if="alertMessage">
      <v-col>
        <v-alert type="error" dismissible>
          {{ alertMessage }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1>En développement</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    alertMessage: null
  })
}
</script>

<style>
.centered {
  text-align: center;
}
</style>
