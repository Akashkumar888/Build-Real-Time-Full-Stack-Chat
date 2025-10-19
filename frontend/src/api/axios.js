
import axios from 'axios'

const api=axios.create({
  url:import.meta.env.VITE_BACKEND_URL
});

export default api;
