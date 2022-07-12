import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from './pages/IndexPage/IndexPage';
import ProductPage from './pages/IndexProductPage/ProductPage';
import NotFoundPage from "./pages/NotFoundPage";
import { Header } from "./components";
import { INDEX_PAGE, PRODUCT_PAGE } from "./routes";
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';
import "./App.css";


function App() {
    document.title = "Void";

    return <Suspense fallback={"Loading"}>
        <BrowserRouter>
            <Header>
                <Routes>
                    <Route path={INDEX_PAGE} element={<IndexPage />} />
                    <Route path={PRODUCT_PAGE} element={<ProductPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Header>
        </BrowserRouter>
    </Suspense>;
}

export default App;
