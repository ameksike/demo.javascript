import React from 'react';
import { IconHeader } from './IconHeader';
import CounterView from './CounterView';
import CounterAct from './CounterAct';

const Home: React.FC = () => {
  return (
    <>
      <IconHeader title="Vite + React + API Context" />

      <div className="card">
        <div className='box box-align-between'>
          <CounterView stl="blue" />
          <CounterView stl="red" />
        </div>

        <div className='box box-vertical'>
          <CounterAct stl="blue" inc={3} />
          <CounterAct stl="red" inc={4} />
        </div>
      </div>
    </>
  );
};

export default Home;
