import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from './pages/IndexPage/IndexPage';
import ProductPage from './pages/ProductPage/ProductPage';
import NotFoundPage from "./pages/NotFoundPage";
import { Header } from "./components";
import { INDEX_PAGE, PRODUCT_PAGE } from "./routes";
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';
import "./App.css";


function App() {
    return (
        <BrowserRouter>
            <Header id={'start'}>
                <Routes>
                    <Route path={INDEX_PAGE} element={<IndexPage />} />
                    <Route path={PRODUCT_PAGE} element={<ProductPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Header>
        </BrowserRouter>
    );
}

export default App;
