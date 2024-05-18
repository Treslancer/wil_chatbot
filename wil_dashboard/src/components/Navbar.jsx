import { Box } from "@mui/material";

function NavBar() {

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

        </Box>
    )
}

export default NavBar