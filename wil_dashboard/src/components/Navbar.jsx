import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "./../assets/Logo.png";

function NavBar({ setLoggedOut }) {
    const handleClick = () => {
        if (location.pathname === '/') useNavigate('/');
        if (location.pathname === '/MainPage') useNavigate('/MainPage');
    };

    return (
        <Box
            position="fixed"
            sx={{
                width: `90%`,
                height: '64px',
                alignItems: "center",
                display: "flex",
                zIndex: 2,
            }}>

            <h1 onClick={handleClick}>DASHBOARD</h1>
            <Box sx={{ ml: '20px' }}>
                <img src={logo} style={{ width: '70px' }} />
            </Box>
            {location.pathname === '/' ?
                (
                    <></>
                ) : (
                    <div style={{ width: 'inherit', display: 'flex', flexDirection: 'row-reverse' }}>
                        <Button
                            onClick={() => {
                                localStorage.setItem('token', '');
                                setLoggedOut(true);
                            }}
                            sx={{
                                backgroundColor: 'white',
                                color: 'black', fontWeight: 'bold',
                                width: '240px', height: '40px', fontSize: '18px'
                            }}>
                            Logout
                        </Button>
                    </div>
                )}
        </Box>
    )
}

export default NavBar