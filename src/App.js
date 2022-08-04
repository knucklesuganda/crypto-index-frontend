import { INDEX_PAGE, INDEX_PRODUCT_PAGE, SAFETOKEN_PRODUCT_PAGE } from "./routes";
import ProductPage from './pages/IndexProductPage/ProductPage';
import SafeTokenPage from "./pages/SafeTokenPage/SafeTokenPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { unsetEvents } from "./web3/wallet/event_handlers";
import IndexPage from './pages/IndexPage/IndexPage';
import NotFoundPage from "./pages/NotFoundPage";
import { Header, Loading } from "./components";
import { Suspense, useEffect } from "react";
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';
import "./App.css";


export default function App() {
    useEffect(() => {
        document.title = "Void";
        return () => { unsetEvents() };
    }, []);

    return <Suspense fallback={<Loading />}>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path={INDEX_PAGE} element={<IndexPage />} />
                <Route path={INDEX_PRODUCT_PAGE} element={<ProductPage />} />
                <Route path={SAFETOKEN_PRODUCT_PAGE} element={<SafeTokenPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    </Suspense>;
}
