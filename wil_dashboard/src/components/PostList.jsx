import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

// Custom function to format the datetime string
const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    
    // Define month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get date components
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Format hours for 12-hour clock
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    
    // Pad minutes and seconds with leading zeros if needed
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    
    // Construct formatted date string
    return `${month} ${day}, ${year} at ${hours}:${minutesStr}:${secondsStr} ${ampm}`;
  };

function PostList(props) {
    const {posts} = props;

    return (
        <List sx={{ width: '80vw', bgcolor: 'background.paper' }}>
            {posts.map(post => {
            
            const formattedDate = formatDateTime(post.post_created);

            return (
            <div >
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar
                        variant='rounded'
                        src="./src/assets/Logo.png"
                        sx={{ width: '50px', height: '50px', marginRight: '1rem', marginLeft: '1rem' }}/>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography variant='h6' sx={{ marginBottom: '1rem' }}>
                                {formattedDate}
                            </Typography>
                        </React.Fragment>
                    }
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="h7"
                                color="text.primary"
                            >
                                {post.content}
                            </Typography>

                            <Typography sx={{ textAlign: 'right', fontSize: '12px', marginTop: '2rem' }}>
                                {post.post_id}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            </div>)})}
        </List>
    );
}

export default PostList