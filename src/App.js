import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { addAccount } from "./web3";
import IndexPage from './pages/IndexPage/IndexPage';
import BuyPage from "./pages/BuyPage/BuyPage";
import { BUY_PAGE, INDEX_PAGE } from "./routes";
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';


function App() {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        addAccount(setAccount);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path={INDEX_PAGE} element={<IndexPage />} />
                <Route path={BUY_PAGE} element={<BuyPage account={account} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
