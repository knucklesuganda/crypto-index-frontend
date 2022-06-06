import { useState, useEffect } from "react";


export default function useVisibility(ref) {

    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
        observer.observe(ref.current);
        return () => { observer.disconnect(); }
    }, [ref]);

    return isIntersecting;
};
