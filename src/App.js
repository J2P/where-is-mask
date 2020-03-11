import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";

function App() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const labels = [
    {short: '별내동', long: '경기도 남양주시 별내동'},
    {short: '신내동', long: '서울특별시 중랑구 신내동'},
    {short: '둔산동', long: '대전광역시 서구 둔산동'},
    {short: '탄방동', long: '대전광역시 서구 탄방동'}
  ]

  const handleQuickSubmit = (addr) => {
    setAddress(addr);
    requestStore(addr);
  };

  const requestStore =  async (addr) => {
    setLoading(true);
    setData(undefined);
    const url = `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${addr}`;
    try {
      const response = await axios.get(url);
      const stores = response.data.stores
      const plenty = stores.filter(store => store.remain_stat === 'plenty')
      const some = stores.filter(store => store.remain_stat === 'some')
      const few = stores.filter(store => store.remain_stat === 'few')
      // const empty = stores.filter(store => store.remain_stat === 'empty')
      setData([...plenty,...some,...few]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    requestStore(address);
  };
  
  const getBgColor = (state) => {
    if (state === 'plenty') {
      return 'green';
    }

    if (state === 'some') {
      return 'yellow';
    }

    if (state === 'few') {
      return 'red';
    }
    
    if (state === 'empty') {
      return 'gray';
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="경기도 남양주시 별내동" />
      </form>
      <div>
        {labels.map((label, index) => (
          <span key={index} className="label" onClick={() => handleQuickSubmit(label.long)}>{label.short}</span>
        ))}
      </div>
      {data ? (
        <ul>
          {data.map((store, index) => (
            <li key={index} className={getBgColor(store.remain_stat)}>
              <h2>
                <a href={`nmap://search?query=${store.addr}&appname=com.example.myapp`} target="_blank" rel="noopener noreferrer">
                  {store.name}  
                </a>
                {store.remain_stat === 'plenty' && <span className="green">100개 이상</span>}
                {store.remain_stat === 'some' && <span className="yellow">30개 이상 100개미만</span>}
                {store.remain_stat === 'few' && <span className="red">2개 이상 30개 미만</span>}
                {store.remain_stat === 'empty' && <span className="gray">1개 이하</span>}
              </h2>
              <p>
                {store.addr}
              </p>
              <p>입고 시간: {store.stock_at}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="sweet-loading">
          <BeatLoader
            size={15}
            margin={5}
            color={"#15aabf"}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}

export default App;
