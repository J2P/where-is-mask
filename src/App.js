import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData(undefined);
    const url = `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${address}`;
    const response = await axios.get(url);
    const stores = response.data.stores
    const plenty = stores.filter(store => store.remain_stat === 'plenty')
    const some = stores.filter(store => store.remain_stat === 'some')
    const few = stores.filter(store => store.remain_stat === 'few')
    setData([...plenty,...some,...few]);
  };

  const handleQuickSubmit = (e, addr) => {
    setAddress(addr);
    handleSubmit(e);
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="경기도 남양주시 별내동" />
      </form>
      <div>
        <span className="label" onClick={(e) => handleQuickSubmit(e, '경기도 남양주시 별내동')}>별내동</span>
        <span className="label" onClick={(e) => handleQuickSubmit(e, '서울특별시 중랑구 신내동')}>신내동</span>
        <span className="label" onClick={(e) => handleQuickSubmit(e, '대전광역시 서구 둔산동')}>둔산동</span>
        <span className="label" onClick={(e) => handleQuickSubmit(e, '대전광역시 서구 탄방동')}>탄방동</span>
      </div>
      {data && <ul>
        {data.map((store, index) => (
          <li key={index}>
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
      </ul>}
    </div>
  );
}

export default App;
