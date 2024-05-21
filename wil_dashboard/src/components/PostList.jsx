import React,{ useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../axiosConfig';

function PostList(selectedCourse) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {

            const formData = new URLSearchParams();
            console.log(selectedCourse);

            try {
                const response = await axiosInstance.get(`https://renderv2-gntp.onrender.com/knowledge_base/get_facebook_posts/`, {
                    params: { course_name:  selectedCourse.selectedCourse}
                });
                const data = response.data;
                setData(data);
            } catch(error) {
                console.error(error)
            }
        }

        fetchPosts();
    }, [selectedCourse])

    return (
        <List sx={{ width: '80vw', bgcolor: 'background.paper' }}>
            {data.map((post, index) => {
            return (
            <>
            <ListItem alignItems="flex-start" key={index}>
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
            </>
            )})}
        </List>
    );
}

export default PostList