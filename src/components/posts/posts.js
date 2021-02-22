import React, { useEffect, useState, useMemo } from "react";
import TableHeader from "./header/header";
import Pagination from "./pagination/pagination";
import Search from "./search/search";
import axios from 'axios';

const DataTable = () => {
    const [posts, setPosts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "No#", field: "id", sortable: true },
        { name: "Name", field: "name", sortable: true },
        { name: "Email", field: "email", sortable: true },
        { name: "Comment", field: "body", sortable: true }
    ];


    useEffect(() => {
        const getData = async () => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/comments")
            setPosts(res.data);
        };
        getData();
    }, []);

    const postsData = useMemo(() => {
        let computedposts = posts;

        if (search) {
            computedposts = computedposts.filter(
                comment =>
                    comment.name.toLowerCase().includes(search.toLowerCase()) ||
                    comment.email.toLowerCase().includes(search.toLowerCase()) ||
                    comment.body.toLowerCase().includes(search.toLowerCase()) 
            );
        }

        setTotalItems(computedposts.length);

        //Sorting posts
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;

            computedposts = computedposts.sort(
                (a, b) => reversed * a[sorting.field].toString().localeCompare(b[sorting.field], undefined, { numeric: true})
            );
        }

        //Current Page slice
        return computedposts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [posts, currentPage, search, sorting]);

    return (
        <>
            <div className="row w-100">
                <div className="col mb-3 col-12 text-center">
                    <div className="row">
                        <div className="d-flex justify-content-end">
                            <Search
                                onSearch={value => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <table className="table table-striped">
                        <TableHeader
                            headers={headers}
                            onSorting={(field, order) =>
                            setSorting({ field, order })
                            }
                        />
                        <tbody>
                            {postsData.map(comment => (
                                <tr key={comment.id}>
                                    <th scope="row" key={comment.id}>
                                        {comment.id}
                                    </th>
                                    <td>{comment.name}</td>
                                    <td>{comment.email}</td>
                                    <td>{comment.body}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center ">
                            <Pagination
                                total={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={page => setCurrentPage(page)}
                            />
                        </div>
            </div>
        </>
    );
};

export default DataTable;