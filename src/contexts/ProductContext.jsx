import { createContext, useContext, useState, useEffect } from 'react';
import { getMenuByCategory } from '~/api/menuItemApi';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            try {
                const response = await getMenuByCategory();
                setProducts(response.data);
                // console.log("Response data:", response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [])

    const value = { products, loading };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => useContext(ProductContext);
