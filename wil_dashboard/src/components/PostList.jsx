import React,{ useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

function PostList(props) {
    const {posts} = props;

    useEffect(() => {
        console.log(posts);
    })

    return (
        <List sx={{ width: '80vw', bgcolor: 'background.paper' }}>
            {posts.map(post => {
            return (
            <div >
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar
                        variant='rounded'
                        src="./src/assets/Logo.png"
                        sx={{ width: '50px', height: '50px', marginRight: '2rem' }}/>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography variant='h6' sx={{ marginBottom: '1rem' }}>
                                {post.post_created}
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
                                Update: 
                            </Typography>
                            {post.content}
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