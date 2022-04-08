import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from './pages/IndexPage/IndexPage';
import { Header } from "./components/Header";
import { INDEX_PAGE } from "./routes";
import 'antd/dist/antd.min.css';
import 'antd/dist/antd.dark.min.css';


function App() {
    return (
        <BrowserRouter>
            <Header id={'start'}>
                <Routes>
                    <Route path={INDEX_PAGE} element={<IndexPage />} />
                </Routes>
            </Header>
        </BrowserRouter>
    );
}

export default App;
