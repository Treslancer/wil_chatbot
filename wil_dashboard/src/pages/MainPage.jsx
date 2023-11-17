import { useState, useEffect } from 'react'
import { Box, Button, Card, List, ListItem, Typography } from "@mui/material";
import NavBar from '../components/Navbar';
import axios from 'axios';
import DisplayTable from "../components/DisplayTable";
import UploadFileDialog from '../components/UploadFIleDialog';

function MainPage() {
    const [openUploadFileWin, setOpenUploadFileWin] = useState(false);
    const [scrapedData, setScrapedData] = useState([]);

    //get scraped data
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5001/wil_scraper');
                setScrapedData(response.data);
                console.log(scrapedData)
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }

        getData(); // Call the fetchData function when the component mounts

    }, []);

    const setUploadFileDialog = () => 
    {
        if(openUploadFileWin === false){
            setOpenUploadFileWin(true);
        } 
        else
            setOpenUploadFileWin(false);
    };

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
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
                    onClick={() => setUploadFileDialog()}
                    sx={{
                        marginTop: '2rem',
                        backgroundColor: '#ffdd00',
                        color: 'black',
                        fontWeight: 'bold',
                        width: '240px',
                        height: '40px',
                        ml: '84%'
                    }}>
                    
                    <UploadFileDialog
                        isOpen = {openUploadFileWin}
                        closeDialog = {setUploadFileDialog}/>
                    Upload

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
        </Box>
    )
}

export default MainPage