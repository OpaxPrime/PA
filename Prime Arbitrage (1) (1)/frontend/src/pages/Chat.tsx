import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import useChatService from '../hooks/useChatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { messages, isLoading, error, sendMessage } = useChatService();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Send message using the chat service
    await sendMessage(input);
    setInput('');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Chat Assistant
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Ask questions about arbitrage opportunities, pricing data, marketplace integration, or get help with using the platform.
        </Typography>
        
        {user?.subscription !== 'premium' && (
          <Typography variant="body2" color="text.secondary">
            Note: Free users have limited chat capabilities. Upgrade to Premium for unlimited chat assistance.
          </Typography>
        )}
      </Paper>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              height: 400, 
              p: 2, 
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <List sx={{ width: '100%' }}>
              {messages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {message.sender === 'assistant' && (
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <SmartToyIcon />
                        </Avatar>
                      </ListItemAvatar>
                    )}
                    
                    <ListItemText
                      primary={message.sender === 'user' ? 'You' : 'Assistant'}
                      secondary={message.text}
                      sx={{
                        maxWidth: '70%',
                        bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                        color: message.sender === 'user' ? 'white' : 'inherit',
                        p: 2,
                        borderRadius: 2,
                        '& .MuiListItemText-primary': {
                          fontWeight: 'bold',
                          color: message.sender === 'user' ? 'white' : 'inherit',
                        },
                        '& .MuiListItemText-secondary': {
                          color: message.sender === 'user' ? 'white' : 'inherit',
                        }
                      }}
                    />
                    
                    {message.sender === 'user' && (
                      <ListItemAvatar sx={{ ml: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                    )}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
              {isLoading && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SmartToyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <CircularProgress size={24} />
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Type your message"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              variant="contained" 
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;