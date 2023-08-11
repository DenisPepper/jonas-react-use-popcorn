import { useState } from 'react';
import {
  containerStyle,
  starContainerStyle,
  starStyle,
  textStyle,
  DEFAULT_STARS_COUNT,
  DEFAULT_RATING_STAR_COLOR,
  DEFAULT_RATING_STAR_SIZE,
} from '../../data';

export const StarRating = (props) => {
  const {
    maxRating = DEFAULT_STARS_COUNT,
    defaultRating = 0,
    color = DEFAULT_RATING_STAR_COLOR,
    borderColor = color,
    borderColorEmptyStar = borderColor,
    size = DEFAULT_RATING_STAR_SIZE,
    css = '',
    messages = [],
  } = props;
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  return (
    <div style={{ ...containerStyle, height: `${size}px` }} className={css}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            mouseClickHandler={() => setRating(i + 1)}
            mouseOverHandler={() => setTempRating(i + 1)}
            mouseOutHandler={() => setTempRating(0)}
            full={tempRating > 0 ? i + 1 <= tempRating : i + 1 <= rating}
            color={color}
            borderColor={borderColor}
            borderColorEmptyStar={borderColorEmptyStar}
            size={size}
          />
        ))}
      </div>
      <p style={{...textStyle, color, fontSize: size}} aria-label='Рейтинг:'>
        {messages.length >= maxRating
          ? messages[tempRating - 1] || messages[rating - 1] || ''
          : tempRating || rating || ''}
      </p>
    </div>
  );
};

const Star = (props) => {
  const {
    mouseClickHandler,
    mouseOverHandler,
    mouseOutHandler,
    full,
    color,
    borderColor,
    borderColorEmptyStar,
    size,
  } = props;

  return (
    <span
      style={{ ...starStyle, width: `${size}px`, height: `${size}px` }}
      aria-hidden='true'
      onClick={mouseClickHandler}
      onMouseEnter={mouseOverHandler}
      onMouseLeave={mouseOutHandler}
    >
      {full ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill={color}
          stroke={borderColor}
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke={borderColorEmptyStar}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='{2}'
            d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
          />
        </svg>
      )}
    </span>
  );
};

/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#000"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

*/
