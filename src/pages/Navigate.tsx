import { useAppSelector } from '../redux/hooks';

function Navigate() {
  const { streams } = useAppSelector((state) => state.media);
  console.log(streams);
  return <div>This route is for testing</div>;
}

export default Navigate;
