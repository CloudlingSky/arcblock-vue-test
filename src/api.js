import axios from 'axios';

export const rawblock = (hash)=>{
  return axios.get('https://blockchain.info/rawblock/'+hash,{

  })
}
