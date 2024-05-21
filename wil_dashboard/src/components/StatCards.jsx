import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from "react";

function StatCards(props) {
    const { cardTitle, count } = props

    const card = (
        <React.Fragment>
          <CardContent >
            <Typography variant="h5" component="div">
              {cardTitle}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Today
            </Typography>
            <Typography variant="h4" component="div">
              {count}
            </Typography>
          </CardContent>
        </React.Fragment>
      );

    return (
        <Box sx={{ width: '20%', marginRight: '2rem', boxShadow: '0px 2px #ffdd00' }}>
            <Card variant="outlined">{card}</Card>
        </Box>
    )
}

export default StatCards;