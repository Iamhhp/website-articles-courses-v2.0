import './Loading.css';

const Loading = () => {
  return (
    <div className='display'>
      <div className='container-loading'>
        <div className='loading' />
        <p className='text-loading'>در حال بارگذاری ...</p>
      </div>
    </div>
  );
};
export default Loading;
