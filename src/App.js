import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { addAccount } from "./web3";
import { createERC20 } from "./web3/contracts/ERC20Contract";
import { createIndex } from "./web3/contracts/IndexContract";
import { signer } from "./web3/wallet/providers";
import IndexPage from './pages/IndexPage/IndexPage';
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';


function App() {
    const [account, setAccount] = useState(null);
    const index = createIndex(
        signer,
        "0xBf6039a681979EbCa20300E1b8E50E40ab50b64a"
    );
    const buyToken = createERC20(
        signer,
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );

    useEffect(() => {
        addAccount(setAccount);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IndexPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
