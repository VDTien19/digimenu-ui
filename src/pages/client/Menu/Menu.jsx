import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Menu.module.scss';
import CategoryList from '~/components/CategoryList';
import ProductList from '~/components/ProductList';
import Loading from '~/components/Loading';
import { useProduct } from '~/contexts/ProductContext';
import { useSearch } from '~/contexts/SearchContext';
import { fetchTable } from '~/store/tableSlice';
import { getMenuItems } from '~/api/menuItemApi';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Menu() {
    const [data, setData] = useState([]);
    const [isValidTable, setIsValidTable] = useState(false);
    const [productList, setProductList] = useState([]);
    // const [loading, setLoading] = useState(false);

    const { products, loading } = useProduct();
    const { searchValue, setSearchValue } = useSearch();

    const dispatch = useDispatch();
    const { listTables } = useSelector((state) => state.table);
    useEffect(() => {
        dispatch(fetchTable());
    }, [dispatch]);

    const query = useQuery();
    const encode = query.get('encode');

    useEffect(() => {
        const isValidTable = encode && listTables?.some((item) => item.encode === encode);
        setIsValidTable(isValidTable);
    }, [listTables, encode]);

    // Clear search value when component unmounts to prevent memory leaks
    useEffect(() => {
        setSearchValue('');
    }, [setSearchValue]);

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await getMenuItems();
                const filterData = response.data.filter(item => item.status === "visible");
                setProductList(filterData);
                // console.log("Fetched products:", filterData);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        }
        fetchProductList();
    }, [])

    useEffect(() => {
        setData(products);
    }, [setData, products]);

    // Filter products based on search value
    const filteredProducts = searchValue
        ? productList.filter((item) =>
            item.status === "visible" &&
            (item.name + item.description)
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            )
        : productList.filter((item) => item.status === "visible");

    // console.log("Products:", productList);
    // console.log("Filtered Products:", filteredProducts);

    if (loading) {
        return (
            <div className={cx('loading', 'fixed', '-inset-0', 'z-999')}>
                <Loading />
            </div>
        );
    }

    if(!isValidTable) {
        return (
            <div className={cx('loading', 'fixed', '-inset-0', 'z-999')}>
                <Loading />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {searchValue && filteredProducts.length > 0 ? (
                <ProductList products={filteredProducts} />
            ) : (
                <CategoryList categories={data} />
            )}
        </div>
    );
}

export default Menu;
