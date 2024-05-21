import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import NavBar from '../components/Navbar';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    const validateForm = () => {
        if (!username || !password) {
            setError('Username and Password are required');
            return false;
        }
        setError('');
        return true;
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try{
            const response = await axiosInstance.post(`https://renderv2-gntp.onrender.com/login`, formData, {
               headers: { 'Content-Type': 'application/x-www-form-urlencoded', }
            });

            if (response.status === 200) {
                const data = await response.data;
                localStorage.setItem('token', data.access_token);
                navigate('/MainPage');
            } else {
                const errorData = await response.data;
                setError(errorData.detail || 'Authentication failed!');
            }
        } catch(error) {
            setLoading(false);
            setError('An Error has occured, Please try again later');
        }
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
                    mt: '4rem',
                }}>
                
                <div style={{ paddingLeft: '2.5rem', width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <h2 style={{ marginTop: '0px', width: 'fit-content' }}>LOGIN</h2>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <TextField
                            id="Username"
                            label="Email"
                            variant="outlined"
                            placeholder='Enter email'
                            sx={{ width: '25vw', marginBottom: '2rem' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <TextField
                            id="Password"
                            label="Password"
                            variant="outlined"
                            type='password'
                            placeholder='Enter password'
                            sx={{ width: '25vw', marginBottom: '2rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {loading ? (
                    <Box display="flex" justifyContent="left" alignItems="center" height="5rem">
                        <CircularProgress sx={{ color: '#ffdd00' }}/>
                    </Box>
                    ) : (
                    <Button
                        onClick={handleSubmit}
                        sx={{ backgroundColor: '#ffdd00',
                            color: 'black',
                            fontWeight: 'bold',
                            width: '240px',
                            height: '40px',
                            mr: '1rem' }}>
                        LOGIN
                    </Button>
                    )}
                </div>
            </Box>
        </Box>
    );
}

export default LoginPage