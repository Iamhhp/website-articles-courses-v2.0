import { memo } from 'react';
import './Footer.css';
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
  return (
    <Container fluid className='container-footer'>
      <Row>
        <Col className='sec-r col-12 col-sm-6'>
          <div>
            <h4>تماس با ما</h4>
            <p>برای پرسش سوالات با اطلاعات بیشتر، با ما تماس بگیرید:</p>
            <p>ایمیل: info@example.com</p>
            <p>شماره تماس: 789-456-123</p>
          </div>
        </Col>

        <Col className='sec-l col-12 col-sm-6'>
          <img src='https://cdn.zarinpal.com/badges/trustLogo/1.svg' alt='' />
        </Col>
      </Row>
    </Container>
  );
};
export default memo(Footer);
