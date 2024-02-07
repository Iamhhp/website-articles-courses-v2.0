import './NoResponse.css';
import { Container } from 'react-bootstrap';
import { VscDebugDisconnect } from 'react-icons/vsc';

const NoResponse = ({ responseState }) => {
  return (
    <Container className='container-no-response'>
      <div className='title'>
        <VscDebugDisconnect className='icon' />
        اطلاعاتی دریافت نشد!
      </div>
      <div className='description'>{responseState}</div>
    </Container>
  );
};
export default NoResponse;
