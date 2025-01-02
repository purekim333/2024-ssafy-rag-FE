import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCounterStore = defineStore('counter', () => {

    const BASE_URL = "https://be-shy-star-45.fly.dev/"

    return { BASE_URL }

})
