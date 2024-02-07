import { useEffect, useState } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState({ responseStatus: '', response: [] });
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((json) => {
            setData((prevState) => ({ ...prevState, responseStatus: `receivedData!`, response: json }));
            setIsPending(false);
          });
        } else {
          setData((prevState) => ({ ...prevState, responseStatus: `${response.statusText} ${response.status}`, response: [] }));
          setIsPending(false);
        }
      })
      .catch((err) => {
        setData((prevState) => ({ ...prevState, responseStatus: 'Failed to Receive Data!', response: [] }));
        setIsPending(false);
      });
  }, []);

  return [data, isPending];
};
export default useFetch;
