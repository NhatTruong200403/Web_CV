import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './App.scss';
import Header from './components/Header';
import { Bounce, ToastContainer } from 'react-toastify';
import { Route } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <div className="App">
        <Header></Header>
        <Container>
          <AppRoutes />
        </Container>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={2}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </div>
    </>
  );
}

export default App;
