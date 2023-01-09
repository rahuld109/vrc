import { FC } from 'react';

interface GridOverlayProps {
  active: boolean;
}

const GridOverlay: FC<GridOverlayProps> = ({ active }) => {
  return (
    <>
      {active ? (
        <div className='grid-container'>
          {new Array(9).fill(0).map((_, index) => {
            return (
              <div key={index + 1} className={`grid-item item-${index + 1}`} />
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default GridOverlay;
