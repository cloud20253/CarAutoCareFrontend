import axios from 'axios';

const API_BASE_URL = 'https://carauto01-production-8b0b.up.railway.app';

<<<<<<< HEAD
// const API_BASE_URL = 'http://localhost:8080';


=======
>>>>>>> 6e92ef39607b57cc613aef214048d804463d5ba7
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
