import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage, Delete, WindowSharp } from "@mui/icons-material";
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import axios from './axiosConfig';
import DeleteFileDialog from "./DeleteFileDialog";

function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5, pr: '0px' }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
                sx={{ color: "black" }}
            >
                <FirstPage />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                sx={{ color: "black" }}
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                sx={{ color: "black" }}
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
                sx={{ color: "black" }}
            >
                <LastPage />
            </IconButton>
        </Box>
    );
}

const rowHeaders = ["FILENAME", "AUTHOR", "DATE"]

const StyledPaper = styled(Paper)(({ theme }) => ({
    background: "rgba(255, 255, 255, 0.5)",
    backgroundBlendMode: "overlay",
    //borderTop: "2px solid #ffdd00",
    color: "white"
}));

function DisplayTable() {
    //data
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [truefname, setTruefname] = useState('');
    const [openDeleteFileWin, setOpenDeleteFileWin] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/get_filename');
                const fileNames = response.data.fileNames;

                const updatedTransactionHistory = fileNames.map(filename => ({
                    filename: filename,
                    author: "Unknown",
                    date: "2021-11-08"
                }));

                setData(updatedTransactionHistory);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts

    }, []); // Empty dependency array to run the effect only once


    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactionhistory.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const setDeleteFileDialog = (filename) => 
    {
        setTruefname(filename)
        if(openDeleteFileWin === false){
            setOpenDeleteFileWin(true);
        } 
        else {
            setOpenDeleteFileWin(false);
        }
    };

    return(
        <StyledPaper>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ borderBottom: "2px solid #ffdd00" }}>
                        {rowHeaders.map((header, index) => (
                            <TableCell
                                key={index}
                                sx={{
                                    color: "black",
                                    fontWeight: 'bold'
                                }}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                        const itemDate = new Date(row.date);
                        itemDate.setDate(itemDate.getDate());
                    return(
                        <TableRow key={index}>
                            <TableCell component="th" scope="row" sx={{color: "black"}}>
                                {row.filename}
                            </TableCell>
                            <TableCell sx={{color: "black"}}>
                                {row.author}
                            </TableCell>
                            <TableCell sx={{color: "black"}}>
                                {itemDate.toISOString().split("T")[0]/*dateOnly*/}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => setDeleteFileDialog(row.filename)} sx={{ color: "white" }}>
                                    <DeleteFileDialog
                                        isOpen = {openDeleteFileWin}
                                        truefname = {truefname}
                                        filename = {row.filename}
                                        closeDialog = {setDeleteFileDialog}/> 
                                    <Delete style={{ color: 'black' }}/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )})}

                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            labelRowsPerPage=''
                            rowsPerPageOptions={[]}
                            colSpan={3}
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            sx={{ color: "black" }}
                            onPageChange={handleChangePage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </StyledPaper>
    );
}

export default DisplayTable;