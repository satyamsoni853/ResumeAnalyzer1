import * as React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="animated-bg" aria-hidden="true">
      <span className="animated-blob blob1" />
      <span className="animated-blob blob2" />
    </div>
  );
};

export default AnimatedBackground;

