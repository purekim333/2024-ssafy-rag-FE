import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCounterStore = defineStore('counter', () => {

    const BASE_URL = "https://ssafy-2024-backend-bitter-rain-3164.fly.dev/"

    return { BASE_URL }

})
