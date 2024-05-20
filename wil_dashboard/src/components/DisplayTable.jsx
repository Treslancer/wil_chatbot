import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage, Delete } from "@mui/icons-material";
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableFooter,
        TableHead, TablePagination, TableRow, FormControl, InputLabel,
        Select, MenuItem, CircularProgress, LinearProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import axiosInstance from '../../axiosConfig';
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

const rowHeaders = ["FILENAME", "COURSE"]

const StyledPaper = styled(Paper)(({ theme }) => ({
    background: "rgba(255, 255, 255, 0.5)",
    backgroundBlendMode: "overlay",
    //borderTop: "2px solid #ffdd00",
    color: "white"
}));

function DisplayTable() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [truefname, setTruefname] = useState('');
    const [openDeleteFileWin, setOpenDeleteFileWin] = useState(false);
    const [filteredCourse, setFilteredCourse] = useState('');
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async () => {
        try {
            const response = await axiosInstance.get(`https://chatbot-private.onrender.com/knowledge_base/get_course/`);
            
            if (response.status === 200) {
                const courses = response.data;
                setAllCourses(courses)
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch(error) {
            console.error(error);
        }
    };

    const handleCourseChange = async (event) => {
        const value = event.target.value;
        setLoading(true);
    
        try {
            const response = await axiosInstance.get(`https://chatbot-private.onrender.com/knowledge_base/get_files_by_course/`, {
                params: { course_name: value }
            });
            if (response.status === 200) {
                const data = response.data;
                setFilteredCourse(value);
                setData(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
      };

    useEffect(() => {

        fetchCourses();

    }, []);


    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

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
            <FormControl fullWidth>
                <InputLabel id="course-select-label">Select Course</InputLabel>
                <Select
                    labelId="course-select-label"
                    id="course-select"
                    label="Select Course"
                    onChange={handleCourseChange}
                    sx={{textAlign: 'left'}}
                >
                    {allCourses.map((course, index) => (
                        <MenuItem key={index} value={course}>{course}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="5rem">
                    <CircularProgress sx={{ color: '#ffdd00' }}/>
                </Box>
            ) : (
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
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course, index) => {
                    return(
                        <TableRow key={index}>
                            <TableCell component="th" scope="row" sx={{color: "black"}}>
                                {course}
                            </TableCell>
                            <TableCell sx={{color: "black"}}>
                                {filteredCourse}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => setDeleteFileDialog(course, filteredCourse)} sx={{ color: "white" }}>
                                    <DeleteFileDialog
                                        isOpen = {openDeleteFileWin}
                                        truefname = {truefname}
                                        filename = {course}
                                        course = {filteredCourse}
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
            )}
        </StyledPaper>
    );
}

export default DisplayTable;