import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";

function App() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState();
  const labels = [
    {short: '별내동', long: '경기도 남양주시 별내동'},
    {short: '신내동', long: '서울특별시 중랑구 신내동'},
    {short: '둔산동', long: '대전광역시 서구 둔산동'},
    {short: '탄방동', long: '대전광역시 서구 탄방동'}
  ]

  const handleQuickSubmit = (index) => {
    const label = labels[index];
    setSelected(label.short);
    setAddress(label.long);
    requestStore(label.long);
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
      const empty = stores.filter(store => store.remain_stat === 'empty')
      setData([...plenty,...some,...few, ...empty]);
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

  const getActive = (short) => selected === short ? 'label active' : 'label';

  if (error) {
    return <div className="App">{error}</div>
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="경기도 남양주시 별내동" />
      </form>
      <div>
        {labels.map((label, index) => (
          <span key={index} className={getActive(label.short)} onClick={() => handleQuickSubmit(index)}>{label.short}</span>
        ))}
      </div>
      {data ? (
        <ul>
          {data.map((store, index) => {
            return (
              <li key={index} className={getBgColor(store.remain_stat)}>
                <article>
                  <h2>
                    <a href={`https://map.kakao.com/?q=${store.addr}`} target="_blank" rel="noopener noreferrer">
                      {store.name}
                    </a>
                  </h2>
                  <p>
                    {store.addr}
                  </p>
                  <p>입고 시간: {store.stock_at}</p>
                </article>
                <div className={getBgColor(store.remain_stat)}>
                  <span className="mask"></span>
                  {store.remain_stat === 'plenty' && <span className="count">100 ~</span>}
                  {store.remain_stat === 'some' && <span className="count">30 ~ 100</span>}
                  {store.remain_stat === 'few' && <span className="count">2 ~ 30</span>}
                  {store.remain_stat === 'empty' && <span className="count">0</span>}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="sweet-loading">
          <BeatLoader
            size={15}
            margin={5}
            color={"#66d9e8"}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}

export default App;
