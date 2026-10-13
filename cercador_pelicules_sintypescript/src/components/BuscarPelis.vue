<script setup>
import { ref } from 'vue'
import { cercar, mesInfoPelis } from '@/services/communicationManager'

const cerca = ref('')
const resultats = ref([])
const info = ref(null)

const carregant = ref(false)
const carregantInfo = ref(false)
const haCercat = ref(false)

async function buscar() {
  if (!cerca.value.trim()) return

  carregant.value = true
  haCercat.value = false
  try {
    resultats.value = (await cercar(cerca.value)) ?? []
  } catch (e) {
    console.error(e)
    resultats.value = []
  } finally {
    carregant.value = false
    haCercat.value = true
  }
}

function netejar() {
  cerca.value = ''
  resultats.value = []
  haCercat.value = false
}

async function mesInfo(imdbID) {
  info.value = null
  carregantInfo.value = true
  try {
    info.value = await mesInfoPelis(imdbID)
  } finally {
    carregantInfo.value = false
  }
}
</script>

<template>
  <v-container>
    <v-text-field
      style="background-color: #1E293B;"
      v-model="cerca"
      label="Què vols cercar?"
      :disabled="carregant"
      @keyup.enter="buscar"
    ></v-text-field>

    <v-btn style="margin-bottom: 10px;
                  margin-top: 10px;
                  background-color: #3B82F6;"
      :disabled="carregant" @click="buscar">
      Cercar
    </v-btn>

    <v-btn style="margin-bottom: 10px;
                  margin-top: 10px;
                  background-color: #3B82F6;"
      class="ml-2"
      :disabled="carregant"
      @click="netejar"
    >
      Netejar
    </v-btn>

    <v-progress-circular
      v-if="carregant"
      indeterminate
      class="my-4"
    ></v-progress-circular>

    <v-alert
      v-if="haCercat && !carregant && resultats.length === 0"
      type="info"
      variant="tonal"
      class="my-4"
    >
      No s'han trobat pel·lícules per a "{{ cerca }}".
    </v-alert>
    <v-row>
      <v-col
    v-for="element in resultats"
    :key="element.imdbID"
    cols="12"
    md="3"
    class="d-flex"
  >
    <v-card
      class="d-flex flex-column w-100"
      style="background-color: #1E293B;"
    >
      <h4 class="titol-peli">
        {{ element.Title }}
        ({{ element.Year }})
      </h4>
      <span>{{ element.Type }}</span>

      <v-img
        :src="element.Poster"
        height="450"
        cover
      ></v-img>

      <v-spacer></v-spacer>

      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            style="margin: 10px 5px 10px 5px; background-color: #3B82F6;"
            v-bind="activatorProps"
            color="surface-variant"
            text="Més Informació"
            variant="flat"
            @click="mesInfo(element.imdbID)"
          ></v-btn>
        </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Plot">
                <v-card-text>
                  <b>Director:</b> {{ info?.Director }}
                </v-card-text>
                <v-card-text>
                    <b>Actors:</b> {{ info?.Actors }}
                </v-card-text>
                <v-card-text>
                    <b>Plot:</b> {{ info?.Plot }}
                </v-card-text>
                <v-card-text>
                    <b>Durada:</b> {{ info?.Runtime }}
                </v-card-text>
                <v-card-text>
                    <b>Genere:</b> {{ info?.Genre }}
                </v-card-text>
                <v-card-text>
                    <b>Valoració:</b> {{ info?.Ratings[0].Value }}
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text="Tancar"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.titol-peli {
  min-height: 3em;
}
</style>