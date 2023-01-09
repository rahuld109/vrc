import React from 'react';

const PROFILE_PLACEHOLDER =
  'https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=1380&t=st=1673255796~exp=1673256396~hmac=a4dd85465a2bf5494b39e5695adb32e363e82cdabdfb08dbea04398c7717515b';

export const UserSection = () => {
  return (
    <section className='user-section'>
      <span className='desc'>
        You are in the process of recordClick a video. The maximum video length
        is three minutes
      </span>

      <div className='user-profile'>
        <img
          src={PROFILE_PLACEHOLDER}
          width={60}
          height={60}
          alt='user image'
        ></img>
        <span>User name</span>
      </div>
    </section>
  );
};
