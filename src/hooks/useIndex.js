import { useState, useEffect } from "react";
import { createIndex } from "../web3/contracts";

export function useIndex(productAddress, providerData) {
    const [index, setIndex] = useState(null);

    useEffect(() => {
        if (providerData === null) {
            return;
        }

        createIndex(productAddress, providerData).then((index) => { setIndex(index); });

        return () => {};
    }, [providerData, productAddress]);

    return index;
}
