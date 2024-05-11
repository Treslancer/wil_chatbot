import React, { useState, useEffect } from 'react';
import { Box, Button, Card, List, ListItem, Typography } from "@mui/material";
import NavBar from '../components/Navbar';
import axios from 'axios';
import DisplayTable from "../components/DisplayTable";
import UploadFileDialog from '../components/UploadFIleDialog';

function MainPage() {
    const [openUploadFileWin, setOpenUploadFileWin] = useState(false);
    const [openUploadTextWin, setOpenUploadTextWin] = useState(false);
    const [openUploadUrlWin, setOpenUploadUrlWin] = useState(false);
    const [scrapedData, setScrapedData] = useState([]);

    // Fetch scraped data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5001/wil_scraper');
                setScrapedData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }

        fetchData(); // Call the fetchData function when the component mounts
    }, []);

    // Function to toggle upload dialog visibility
    const setUploadFileDialog = (dialogType) => {
        if (dialogType === 'file') setOpenUploadFileWin(!openUploadFileWin);
        if (dialogType === 'text') setOpenUploadTextWin(!openUploadTextWin);
        if (dialogType === 'url') setOpenUploadUrlWin(!openUploadUrlWin);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <NavBar />
            <Box
                position='relative'
                sx={{
                    paddingTop: "64px",
                    flexGrow: 1,
                    height: "90%",
                    width: "90%",
                    mt: '2rem',
                }}>

                <h2>FILE TABLE</h2>
                <DisplayTable />
                <Button
                    onClick={() => setUploadFileDialog('file')}
                    sx={{ backgroundColor: '#ffdd00', color: 'black', fontWeight: 'bold', width: '240px', height: '40px', mr: '1rem' }}
                >
                    Upload File
                </Button>
                <Button
                    onClick={() => setUploadFileDialog('url')}
                    sx={{ backgroundColor: '#ffdd00', color: 'black', fontWeight: 'bold', width: '240px', height: '40px', mr: '1rem' }}
                >
                    Upload URL
                </Button>
                <Button
                    onClick={() => setUploadFileDialog('text')}
                    sx={{ backgroundColor: '#ffdd00', color: 'black', fontWeight: 'bold', width: '240px', height: '40px' }}
                >
                    Upload Text
                </Button>

                <h2>TBI UPDATES</h2>
                {Array.isArray(scrapedData) && scrapedData.length > 0 ? (
                    <List style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '90vw', overflow: 'hidden' }}>
                        {scrapedData.map((p, index) => (
                            <ListItem key={index} style={{ flexBasis: 'calc(16.666% - 20px)', margin: '10px' }}>
                                <Card sx={{ width: '25vh', height: '50vh', maxHeight: 'fit-content', padding: '20px', borderTop: '2px solid #ffdd00' }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {p.text}
                                    </Typography>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <p>No data available</p>
                )}
            </Box>
            <UploadFileDialog
                isOpen={openUploadFileWin}
                closeDialog={() => setOpenUploadFileWin(false)}
                uploadType="file"
            />
            <UploadFileDialog
                isOpen={openUploadTextWin}
                closeDialog={() => setOpenUploadTextWin(false)}
                uploadType="text"
            />
            <UploadFileDialog
                isOpen={openUploadUrlWin}
                closeDialog={() => setOpenUploadUrlWin(false)}
                uploadType="url"
            />
        </Box>
    );
}

export default MainPage;