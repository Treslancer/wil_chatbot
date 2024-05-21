import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { Box, Button } from "@mui/material";
import NavBar from '../components/Navbar';
import DisplayTable from "../components/DisplayTable";
import UploadFileDialog from '../components/UploadFIleDialog';
import StatCards from '../components/StatCards';
import { BungalowTwoTone } from '@mui/icons-material';

function MainPage() {
    const navigate = useNavigate();
    const [loggedOut, setLoggedOut] = useState(false);
    const [verified, setVerified] = useState(false);
    
    useEffect(() => {
        const verifyToken = async () => {
            
            const usertoken = localStorage.getItem('token');
            console.log(usertoken);
            const formData = new URLSearchParams();
            
            try {
                if (loggedOut) {
                    setVerified(false)
                    console.log('Logged out');
                    localStorage.removeItem('token');
                    navigate('/');
                    return
                }

                const response = await axiosInstance.post(`https://renderv2-gntp.onrender.com/verify_user`, formData, {
                    params: { token: usertoken}
                });

                setVerified(true);
            } catch(error) {
                console.error(error);
                localStorage.removeItem('token');
                navigate('/');
            }
        };

        verifyToken();
    }, [navigate, loggedOut]);

    const [openUploadFileWin, setOpenUploadFileWin] = useState(false);
    const [openUploadTextWin, setOpenUploadTextWin] = useState(false);
    const [openUploadUrlWin, setOpenUploadUrlWin] = useState(false);
    const [conversationCount, setConversationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [fileCount, setFileCount] = useState(0)
    const [conversationFetchLoading, setConversationFetchLoading] = useState(false);
    const [messageFetchLoading, setMessageFetchLoading] = useState(false);
    const [fileFetchLoading, setFileFetchLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('')
;
    // Function to toggle upload dialog visibility
    const setUploadFileDialog = (dialogType) => {
        if (dialogType === 'file') setOpenUploadFileWin(!openUploadFileWin);
        if (dialogType === 'text') setOpenUploadTextWin(!openUploadTextWin);
        if (dialogType === 'url') setOpenUploadUrlWin(!openUploadUrlWin);
    };
    
    if (verified) {
    return (
        <Box sx={{ display: 'flex' }}>
            <NavBar setLoggedOut={setLoggedOut}/>
            <Box
                position='relative'
                sx={{
                    paddingTop: "64px",
                    flexGrow: 1,
                    height: "90%",
                    width: "90%",
                    mt: '4rem',
                }}>
                <div style={{ marginBottom: '5rem', display: 'flex', flexDirection: 'row' }}>
                    <StatCards cardTitle = 'Conversations' count = {conversationCount} loading = {conversationFetchLoading}/>
                    <StatCards cardTitle = 'Messages' count = {messageCount} loading = {messageFetchLoading}/>
                    <StatCards cardTitle = 'Files' count = {fileCount} loading = {fileFetchLoading}/>
                </div>

                <h2 style={{textAlign: 'left', marginTop: '0px', position: 'absolute'}}>KNOWLEDGE BASE</h2>
                <div style={{marginBottom: '1.5rem', display: 'flex', flexDirection: 'row-reverse'}}>
                    <Button
                        onClick={() => setUploadFileDialog('file')}
                        sx={{ backgroundColor: '#ffdd00', color: 'black', fontWeight: 'bold', width: '240px', height: '40px' }}
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
                        sx={{ backgroundColor: '#ffdd00', color: 'black', fontWeight: 'bold', width: '240px', height: '40px', mr: '1rem' }}
                    >
                        Upload Text
                    </Button>
                </div>
                <DisplayTable
                    setConversationCount={setConversationCount}
                    setMessageCount={setMessageCount}
                    setConversationFetchLoading={setConversationFetchLoading}
                    setMessageFetchLoading={setMessageFetchLoading}
                    setFileCount={setFileCount}
                    setFileFetchLoading={setFileFetchLoading}/>

                <h2 style={{textAlign: 'left', marginTop: '0px', position: 'absolute'}}>TBI UPDATES</h2>
                <div style={{marginBottom: '1.5rem', display: 'flex', flexDirection: 'row-reverse'}}>
                    <Button
                        sx={{ backgroundColor: '#ffdd00', color: 'black', fontWeight: 'bold', width: '240px', height: '40px' }}
                    >
                        Ingest
                    </Button>
                </div>
                
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
    } else {
        return (
            <></>
        );
    }
}

export default MainPage;