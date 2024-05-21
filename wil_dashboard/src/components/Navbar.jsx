import { Box, Button } from "@mui/material";

function NavBar({ setLoggedOut }) {

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
            
            <h1>DASHBOARD</h1>
            <Box sx={{ ml: '20px' }}>
                <img src="./src/assets/Logo.png" style={{ width: '70px' }}/>
            </Box>
            {location.pathname === '/' ?
            (
                <></>
            ) : (
            <div style={{ width: 'inherit', display: 'flex', flexDirection: 'row-reverse' }}>
                <Button
                    onClick={() => {
                        localStorage.setItem('token','');
                        setLoggedOut(true);
                    }}
                    sx={{ backgroundColor: 'white',
                    color: '#ffdd00', fontWeight: 'bold',
                    width: '240px', height: '40px', fontSize: '18px' }}>
                    Logout
                </Button>
            </div>
            )}
        </Box>
    )
}

export default NavBar