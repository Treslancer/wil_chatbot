import { useState } from "react";
import axiosInstance from '../../axiosConfig';
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, Box, Typography, TextField } from "@mui/material";

const UploadFileDialog = ({ isOpen, closeDialog, uploadType }) => {
    const [file, setFile] = useState(null);
    const [course, setCourse] = useState("");
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const [topic, setTopic] = useState("");
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

    const handleTopicChange = (event) => {
        setTopic(event.target.value)
    }

    const uploadFile = async () => {
        console.log('Uploading file...');
        if (!file || !course) {
            setIsError(true);
            setErrorMessage('Please provide a file and specify the course');
            console.error('Error: Please provide a file and specify the course');
            return;
        }
        setIsError(false);
        setStatusMessage('Uploading file...');
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await axiosInstance.post('https://chatbot-private.onrender.com/ingest_data/uploadfile/', formData, {
                params: { course_name: course }
            });
            console.log(response.data);
            setStatusMessage('FILE uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            setIsError(true);
            setErrorMessage(error.response?.data?.detail || 'An error occurred during file upload');
        }
    };

    const uploadURL = async () => {
        console.log('Uploading URL...');
        if (!url || !course) {
            setIsError(true);
            setErrorMessage('Please provide a URL and specify the course');
            console.error('Error: Please provide a URL and specify the course');
            return;
        }
        setIsError(false);
        setStatusMessage('Uploading URL...');
        const formData = new FormData();

        try {
            const response = await axiosInstance.post('https://chatbot-private.onrender.com/ingest_data/downloadlink/', formData, {
                params: {
                    download_link: url,
                    course_name: course
                }
            });
            console.log(response.data);
            setStatusMessage('URL uploaded successfully!');
        } catch (error) {
            console.error('Error uploading URL:', error);
            setIsError(true);
            setErrorMessage(error.response?.data?.detail || 'An error occurred during URL upload');
        }
    };

    const uploadText = async () => {
        console.log('Uploading text...');
        if (!text || !course) {
            setIsError(true);
            setErrorMessage('Please provide text and specify the course');
            console.error('Error: Please provide text and specify the course');
            return;
        }
        setIsError(false);
        setStatusMessage('Uploading text...');

        const data = {
            topic: topic,
            text: text
        };
    
        try {
            const response = await axiosInstance.post('https://chatbot-private.onrender.com/ingest_data/add_text_knowledge_base/', data, {
                params: { course_name: course },
                headers: { 'Content-Type': 'application/json'   }
            });
            console.log(response.data);
            setStatusMessage('TEXT uploaded successfully!');
        } catch (error) {
            console.error('Error uploading text:', error);
            setIsError(true);
            setErrorMessage(error.response?.data?.detail || 'An error occurred during text upload');
        }
    };    

    // Choose the upload function based on the upload type
    const uploadContent = () => {
        switch (uploadType) {
            case 'file':
                uploadFile();
                break;
            case 'url':
                uploadURL();
                break;
            case 'text':
                uploadText();
                break;
            default:
                setIsError(true);
                setErrorMessage('Invalid upload type');
                console.error('Error: Invalid upload type');
                break;
        }
    };

    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>UPLOAD {uploadType.toUpperCase()}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: '500px' }}>
                    {['file', 'url', 'text'].includes(uploadType) && (
                        <TextField
                            label="Course"
                            variant="outlined"
                            fullWidth
                            value={course}
                            onChange={handleCourseChange}
                        />
                    )}
                    {uploadType === 'file' && (
                        <TextField
                            type="file"
                            onChange={handleFileChange}
                            variant="outlined"
                            fullWidth
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
                            label="Topic"
                            variant="outlined"
                            fullWidth
                            value={topic}
                            onChange={handleTopicChange}
                        />
                    )}
                    {uploadType === 'text' && (
                        <TextField
                            label="Input Text"
                            variant="standard"
                            multiline
                            value={text}
                            onChange={handleTextChange}
                        />
                    )}
                    <Button
                        onClick={uploadContent}
                        sx={{
                            backgroundColor: '#ffdd00',
                            color: 'black',
                            fontWeight: 'bold',
                            width: '240px',
                            height: '40px',
                            mr: '1rem' }}
                    >
                        Upload {uploadType.toUpperCase()}</Button>
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