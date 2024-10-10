<template>
  <Page>
    <ActionBar>
      <Label text="AI Motivational Support" class="font-bold text-lg"/>
    </ActionBar>

    <StackLayout class="p-4">
      <Label class="text-xl text-center text-gray-700 mb-4" text="Choose your motivational AI personality:" />
      
      <StackLayout class="mb-4">
        <Button v-for="personality in personalities" :key="personality.id" :text="personality.name" @tap="selectPersonality(personality)" class="btn btn-primary mb-2" />
      </StackLayout>

      <Label v-if="selectedPersonality" class="text-lg text-center text-gray-600 mb-4" :text="'Selected: ' + selectedPersonality.name" />

      <Button text="Get Motivation" @tap="getMotivation" class="btn btn-success" :isEnabled="!!selectedPersonality" />

      <Label v-if="motivationalMessage" class="text-lg text-center text-gray-800 mt-4 p-4 bg-gray-200 rounded-lg" :text="motivationalMessage" textWrap="true" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";

interface Personality {
  id: number;
  name: string;
  theme: string;
}

export default Vue.extend({
  data() {
    return {
      personalities: [
        { id: 1, name: "Optimistic Ollie", theme: "positivity and hope" },
        { id: 2, name: "Resilient Rita", theme: "overcoming challenges" },
        { id: 3, name: "Mindful Max", theme: "present-moment awareness" },
        { id: 4, name: "Energetic Ellie", theme: "enthusiasm and action" },
      ] as Personality[],
      selectedPersonality: null as Personality | null,
      motivationalMessage: "",
    };
  },
  methods: {
    selectPersonality(personality: Personality) {
      this.selectedPersonality = personality;
      this.motivationalMessage = "";
    },
    getMotivation() {
      if (this.selectedPersonality) {
        // In a real app, this would call an AI service. For now, we'll use predefined messages.
        const messages = [
          `Remember, ${this.selectedPersonality.name} believes in you! Focus on ${this.selectedPersonality.theme} to achieve your goals.`,
          `${this.selectedPersonality.name} says: Embrace ${this.selectedPersonality.theme}, and watch how it transforms your day!`,
          `Let ${this.selectedPersonality.name}'s wisdom guide you: ${this.selectedPersonality.theme} is your superpower!`,
        ];
        this.motivationalMessage = messages[Math.floor(Math.random() * messages.length)];
      }
    },
  },
});
</script>

<style scoped>
.btn {
  font-size: 18;
  padding: 10;
  margin: 5;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-success {
  background-color: #28a745;
  color: white;
}
</style>