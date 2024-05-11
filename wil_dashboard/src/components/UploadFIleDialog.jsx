import { useState } from "react";
import axios from '../../axiosConfig';
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, Box, Typography, TextField } from "@mui/material";

const UploadFileDialog = ({ isOpen, closeDialog, uploadType }) => {
    const [file, setFile] = useState(null);
    const [course, setCourse] = useState("");
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCourseChange = (event) => {
        setCourse(event.target.value);
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const uploadContent = async () => {
        setIsError(false); // Reset error state
        setStatusMessage(`Uploading ${uploadType}...`);

        const formData = new FormData();
        if (uploadType === 'file') {
            if (!file || !course) {
                setIsError(true);
                setErrorMessage('Please provide a file and specify the course');
                return;
            }
            formData.append('file', file);
            formData.append('course_name', course);
        } else if (uploadType === 'url') {
            if (!url) {
                setIsError(true);
                setErrorMessage('Please provide a URL');
                return;
            }
            formData.append('url', url);
        } else if (uploadType === 'text') {
            if (!text) {
                setIsError(true);
                setErrorMessage('Please provide text');
                return;
            }
            formData.append('text', text);
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/ingest_data/uploadfile/`, formData);
            console.log(response.data);
            setStatusMessage(`${uploadType.toUpperCase()} uploaded successfully!`);
        } catch (error) {
            console.error(`Error uploading ${uploadType}:`, error);
            setIsError(true);
            setErrorMessage(error.response?.data?.detail || `An error occurred during ${uploadType} upload`);
        }
    };

    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>UPLOAD {uploadType.toUpperCase()}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    {uploadType === 'file' && (
                        <TextField
                            type="file"
                            onChange={handleFileChange}
                            variant="outlined"
                            fullWidth
                        />
                    )}
                    {uploadType === 'file' && (
                        <TextField
                            label="Course"
                            variant="outlined"
                            fullWidth
                            value={course}
                            onChange={handleCourseChange}
                        />
                    )}
                    {uploadType === 'url' && (
                        <TextField
                            label="Download Link"
                            variant="outlined"
                            fullWidth
                            value={url}
                            onChange={handleUrlChange}
                        />
                    )}
                    {uploadType === 'text' && (
                        <TextField
                            label="Input Text"
                            variant="outlined"
                            fullWidth
                            value={text}
                            onChange={handleTextChange}
                        />
                    )}
                    <Button onClick={uploadContent} color="primary" variant="contained">Upload {uploadType.toUpperCase()}</Button>
                    {isError && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    {!isError && statusMessage && (
                        <Typography color="primary" sx={{ mt: 2 }}>
                            {statusMessage}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadFileDialog;