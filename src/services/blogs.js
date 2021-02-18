import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
//Moduulille on määritelty vain moduulin sisällä näkyvä muuttuja token, 
//jolle voidaan asettaa arvo moduulin exporttaamalla funktiolla setToken
const setToken = newToken => {
  token = `bearer ${newToken}`
}
//Haetaan kaikki blogit
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
//Luodaan uusi blogi
//Async/await-syntaksi asettaa moduulin tallessa pitämän 
//tokenin Authorization-headeriin, jonka se antaa axiosille metodin post kolmantena parametrina
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }