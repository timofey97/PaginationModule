import './App.css';
import React from 'react';

import Posts from './components/posts/posts';


function App() {

  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-3">Pagination module</h1>
    <Posts/>
    </div>
  );
}

export default App;
