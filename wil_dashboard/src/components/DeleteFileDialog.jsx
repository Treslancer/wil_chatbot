import { Button, Dialog, DialogContent, DialogTitle, DialogActions, Box, Typography } from "@mui/material";
import axios from './axiosConfig';
import { useState } from "react";
const DeleteFileDialog = (props) => {
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = async () => {
        try {
            const response = await axios.delete('http://127.0.0.1:5000/delete_item', {
              data: { item: props.filename }, // Pass the item name in the request body
            });
      
            console.log(response.data); // Log the server response message
            // Handle the response or update your component state as needed
            window.location.reload();
          } catch (error) {
            console.error("Error deleting item:", error);
            // Handle errors, such as network issues or server errors
          }
        
        // Close the dialog
        handleClose();
    };

    const handleClose = () => {
        props.closeDialog();
    };

    return (
        <>{console.log(props.filename + " | " + props.truefname)}
            <Dialog open={props.filename === props.truefname && props.isOpen ? true : false }>
                <DialogTitle sx={{ fontWeight: 'bold' }}>DELETE FILE</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        display: 'flex',
                        JustifyContent: 'center',   
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}>
                        <Typography>
                            Are you sure you want to delete {props.filename}?
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box sx={{
                        display: 'flex',
                        JustifyContent: 'space-between' ,
                        alignItems: 'center',
                        flexDirection: 'row',
                        pr: "1rem",
                        m: "0rem 1.5rem 1.5rem 1.5rem"
                    }}>
                        <Button
                            onClick={handleSave}
                            sx={{
                                marginTop: '2rem',
                                backgroundColor: '#ffdd00',
                                color: 'black',
                                fontWeight: 'bold',
                                width: '200px',
                                height: '40px',
                                m: '1rem'
                            }}>
                            Delete
                        </Button>
                        <Button
                            onClick={handleClose}
                            sx={{
                                marginTop: '2rem',
                                backgroundColor: '#ffdd00',
                                color: 'black',
                                fontWeight: 'bold',
                                width: '200px',
                                height: '40px',
                                m: '1rem'
                            }}>
                            Cancel
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default DeleteFileDialog;