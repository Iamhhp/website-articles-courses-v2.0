import { useEffect, useState } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((json) => {
            setData([...json]);
            setIsPending(false);
          });
        } else {
          setData({ responseStatus: `${response.statusText} ${response.status}` });
          setIsPending(false);
        }
      })
      .catch((err) => {
        setData({ responseStatus: 'Failed to Receive Data!' });
        setIsPending(false);
      });
  }, []);

  return [data, isPending];
};
export default useFetch;
