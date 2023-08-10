const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle = {
  display: 'flex',
  gap: '4px',
};

const textStyle = {
  lineHeight: '1',
  margin: '0',
};

const DEFAULT_STARS_COUNT = 5;

export const StarRating = (props) => {
  const { maxRating = DEFAULT_STARS_COUNT } = props;

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span style={textStyle}>⭐{i + 1}</span>
        ))}
      </div>
      <span>😺</span>
    </div>
  );
};
