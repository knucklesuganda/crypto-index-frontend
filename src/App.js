import { Suspense } from "react";
import { Header, Loading } from "./components";
import NotFoundPage from "./pages/NotFoundPage";
import IndexPage from './pages/IndexPage/IndexPage';
import { INDEX_PAGE, PRODUCT_PAGE } from "./routes";
import ProductPage from './pages/IndexProductPage/ProductPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';
import "./App.css";


function App() {
    document.title = "Void";

    return <Suspense fallback={<Loading />}>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path={INDEX_PAGE} element={<IndexPage />} />
                <Route path={PRODUCT_PAGE} element={<ProductPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    </Suspense>;
}

export default App;
