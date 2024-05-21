import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import * as React from "react";

function StatCards(props) {
    const { cardTitle, count, loading } = props

    const card = (
        <React.Fragment>
          <CardContent >
            <Typography variant="h5" component="div">
              {cardTitle}
            </Typography>
            <Typography color="text.secondary">
                Total
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="5rem">
                    <CircularProgress sx={{ color: '#ffdd00' }}/>
                </Box>
            ) : (
            <Typography variant="h4" component="div" sx={{marginTop: '1.5rem'}}>
              {count}
            </Typography>
            )}
          </CardContent>
        </React.Fragment>
      );

    return (
        <Box sx={{ width: '20%', marginRight: '2rem', boxShadow: '0px 2px #ffdd00' }}>
            <Card variant="outlined" sx={{height: '10rem'}}>{card}</Card>
        </Box>
    )
}

export default StatCards;