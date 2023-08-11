import React from 'react';
import ReactDOM from 'react-dom/client';
/* import './index.css';
import { App } from './components/app/app'; */
import { StarRating } from './components/star-rating/star-rating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StarRating maxRating={5} />
    <StarRating
      maxRating={4}
      color={'red'}
      css={'rating-wrapper'}
      size={64}
      messages={['very bad', 'bad', 'normal', 'good', 'very good']}
    />
    <StarRating
      maxRating={5}
      defaultRating={3}
      color={'#7FFF00'}
      borderColor={'black'}
      css={'rating-wrapper'}
      size={64}
      messages={['very bad', 'bad', 'normal', 'good', 'very good']}
    />
  </React.StrictMode>
);
