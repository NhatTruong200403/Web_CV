import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './App.scss';
import Header from './components/Header';
import AdminHeader from './components/Admin/AdminHeader'; // Import AdminHeader
import Footer from './components/Footer';
import { Bounce, ToastContainer } from 'react-toastify';
// import { Route } from 'react-router-dom'; // Không cần Route ở đây
import AppRoutes from './routes/AppRoutes';
// import Home from './components/Admin/AdminHeader'; // Import trùng lặp và không dùng tên Home
import { useAuth } from './provider/AuthProvider';

function App() {
  const { auth } = useAuth();
  // Sử dụng key trên div ngoài cùng với auth.token để re-render mạnh mẽ hơn khi auth thay đổi nếu cần
  return (
    <>
      {/* Đảm bảo class App bao gồm cả Header và Footer nếu muốn style chung */}
      <div className="d-flex flex-column min-vh-100 App">
        {/* Header được render dựa trên role */}
        {!auth.token || auth.role !== "Admin" ? <Header /> : <AdminHeader />}

        {/* Content Area */}
        <Container className="mt-4 mb-4 flex-grow-1">
          <AppRoutes /> {/* Nội dung chính thay đổi dựa trên route */}
        </Container>

        {/* Toast Container */}
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
          transition={Bounce} // Sử dụng Bounce đã import
        />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;