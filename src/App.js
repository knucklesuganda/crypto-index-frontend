import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { addAccount } from "./web3";
import IndexPage from './pages/IndexPage/IndexPage';
import { Header } from "./components/Header";
import { INDEX_PAGE } from "./routes";
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';


function App() {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        addAccount(setAccount);
    }, []);

    return (
        <BrowserRouter>
            <Header id={'start'}>
                <Routes>
                    <Route path={INDEX_PAGE} element={<IndexPage account={account} startId={"start"} />} />
                </Routes>
            </Header>
        </BrowserRouter>
    );
}

export default App;
