import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
  Fade
} from '@mui/material';
import {
  SmartToy,
  Close,
  AutoFixHigh,
  Translate,
  Psychology,
  Summarize,
  Edit,
  Add,
  Analytics,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { AIService } from '../services/aiService';
import type { AIResponse } from '../services/aiService';

// Check if we're in production mode
const isProduction = import.meta.env.PROD;

interface FloatingAIToolsProps {
  inputText: string;
  onOutputChange: (text: string) => void;
}

const FloatingAITools: React.FC<FloatingAIToolsProps> = ({ inputText, onOutputChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [targetStyle, setTargetStyle] = useState('professional');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [expansionType, setExpansionType] = useState('adding examples');
  const [contentType, setContentType] = useState('article');
  const [contentLength, setContentLength] = useState('medium');
  const [topic, setTopic] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string>('');
  const [userToken, setUserToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [useStreaming, setUseStreaming] = useState(false);

  const handleAIAction = async (action: (() => Promise<AIResponse>) | ((onChunk: (chunk: string) => void) => Promise<AIResponse>)) => {
    if (!inputText.trim()) {
      setError('Please enter some text first');
      return;
    }

    // Check if we have a token (development or user-provided)
    if (import.meta.env.PROD && !window.userGitHubToken) {
      setShowTokenInput(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result: AIResponse;
      
             if (useStreaming && action.length > 0) {
         // Streaming action
         let streamingContent = "";
         console.log("Starting streaming mode...");
         result = await (action as (onChunk: (chunk: string) => void) => Promise<AIResponse>)((chunk: string) => {
           streamingContent += chunk;
           console.log("Streaming chunk:", chunk, "Total:", streamingContent);
           // Force immediate update for streaming
           onOutputChange(streamingContent);
         });
         console.log("Streaming completed, final result:", result);
       } else {
         // Non-streaming action
         result = await (action as () => Promise<AIResponse>)();
         if (result.success && result.content) {
           onOutputChange(result.content);
         }
       }
      
      if (!result.success) {
        setError(result.error || 'Failed to process text');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = () => {
    if (userToken.trim()) {
      window.userGitHubToken = userToken.trim();
      setShowTokenInput(false);
      setUserToken('');
      setError(null);
    } else {
      setError('Please enter a valid GitHub token');
    }
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) {
      setError('Please enter a custom prompt');
      return;
    }

    await handleAIAction(() => 
      AIService.generateResponse(customPrompt, "You are a helpful AI assistant that follows user instructions precisely.")
    );
  };



  const handleStyleTransfer = async () => {
    await handleAIAction(() => 
      AIService.changeStyle(inputText, targetStyle)
    );
  };

  const handleTranslation = async () => {
    await handleAIAction(() => 
      AIService.translateText(inputText, targetLanguage)
    );
  };

  const handleExpansion = async () => {
    await handleAIAction(() => 
      AIService.expandText(inputText, expansionType)
    );
  };

  const handleContentGeneration = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    await handleAIAction(() => 
      AIService.generateContent(topic, contentType, contentLength)
    );
  };

  const openDialog = (type: string) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType('');
  };

  const quickTools = [
    {
      key: 'summarize',
      label: 'Summarize',
      icon: <Summarize />,
      action: useStreaming 
        ? (onChunk: (chunk: string) => void) => AIService.summarizeTextStreaming(inputText, 150, onChunk)
        : () => AIService.summarizeText(inputText),
      description: 'Create a concise summary'
    },
    {
      key: 'correct',
      label: 'Fix Grammar',
      icon: <AutoFixHigh />,
      action: useStreaming
        ? (onChunk: (chunk: string) => void) => AIService.correctGrammarStreaming(inputText, onChunk)
        : () => AIService.correctGrammar(inputText),
      description: 'Correct grammar & style'
    },
    {
      key: 'analyze',
      label: 'Analyze',
      icon: <Analytics />,
      action: useStreaming
        ? (onChunk: (chunk: string) => void) => AIService.analyzeTextStreaming(inputText, onChunk)
        : () => AIService.analyzeText(inputText),
      description: 'Get text insights'
    }
  ];

  const advancedTools = [
    {
      key: 'style',
      label: 'Change Style',
      icon: <Edit />,
      action: () => {
        openDialog('style');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Transform writing style'
    },
    {
      key: 'translate',
      label: 'Translate',
      icon: <Translate />,
      action: () => {
        openDialog('translate');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Translate to other languages'
    },
    {
      key: 'expand',
      label: 'Expand',
      icon: <Add />,
      action: () => {
        openDialog('expand');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Add more detail'
    },
    {
      key: 'generate',
      label: 'Generate',
      icon: <Psychology />,
      action: () => {
        openDialog('generate');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Create new content'
    }
  ];

  return (
    <>
      {/* Production Mode Notice */}
      {isProduction && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1001,
            maxWidth: 600,
            width: '90%'
          }}
        >
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '& .MuiAlert-message': {
                fontSize: '0.875rem'
              }
            }}
            action={
              <Button
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => window.open('https://github.com/novasuitelabs/textmodifiers/blob/main/ENVIRONMENT_SETUP.md', '_blank')}
                sx={{ ml: 1 }}
              >
                Setup Guide
              </Button>
            }
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              🚀 Want to use AI features?
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.9 }}>
              AI features are only available in development mode. To use them in production, 
              you'll need to set up your own GitHub token. Click "Setup Guide" for detailed instructions.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Floating AI Button */}
      <Box
        sx={{
          position: 'fixed',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        {/* Glowing Ring Animation */}
        <Box
          sx={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #6750A4, #625B71, #6750A4)',
            backgroundSize: '200% 200%',
            animation: 'glow 3s ease-in-out infinite',
            opacity: 0.3,
            filter: 'blur(8px)',
            '@keyframes glow': {
              '0%, 100%': {
                backgroundPosition: '0% 50%',
                transform: 'scale(1)',
              },
              '50%': {
                backgroundPosition: '100% 50%',
                transform: 'scale(1.1)',
              },
            },
          }}
        />
        
        {/* Main AI Button */}
        <Tooltip title="AI-Powered Tools" placement="left">
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: 'primary.main',
              color: 'white',
              boxShadow: '0 4px 20px rgba(103, 80, 164, 0.4)',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 6px 25px rgba(103, 80, 164, 0.6)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <SmartToy sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>

        {/* Azure OpenAI Branding */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.7rem',
            textAlign: 'center',
            maxWidth: 80,
            lineHeight: 1.2,
            opacity: 0.8,
          }}
        >
          Powered by Azure OpenAI GPT-4.1-nano
        </Typography>
      </Box>

             {/* Floating AI Panel */}
       <Fade in={isOpen} mountOnEnter unmountOnExit>
         <Paper
           sx={{
             position: 'fixed',
             right: 100,
             top: '50%',
             transform: 'translateY(-50%)',
             width: isExpanded ? 320 : 280,
             maxHeight: '80vh',
             zIndex: 999,
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
             borderRadius: 3,
             border: '1px solid',
             borderColor: 'divider',
             display: 'flex',
             flexDirection: 'column',
             transition: 'width 0.3s ease',
             overflow: 'hidden',
           }}
         >
                     {/* Header */}
           <Box
             sx={{
               p: 1.5,
               borderBottom: '1px solid',
               borderColor: 'divider',
               background: 'linear-gradient(135deg, #6750A4 0%, #625B71 100%)',
               color: 'white',
             }}
           >
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem' }}>
                 <SmartToy sx={{ fontSize: 20 }} />
                 AI Tools
               </Typography>
               <Box sx={{ display: 'flex', gap: 0.5 }}>
                 <IconButton
                   size="small"
                   onClick={() => setIsExpanded(!isExpanded)}
                   sx={{ color: 'white', p: 0.5 }}
                 >
                   {isExpanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                 </IconButton>
                 <IconButton
                   size="small"
                   onClick={() => setIsOpen(false)}
                   sx={{ color: 'white', p: 0.5 }}
                 >
                   <Close sx={{ fontSize: 16 }} />
                 </IconButton>
               </Box>
             </Box>
             <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.65rem' }}>
               Azure OpenAI Service • GPT-4.1-nano
             </Typography>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
               <Chip
                 label={useStreaming ? "Streaming ON" : "Streaming OFF"}
                 size="small"
                 variant={useStreaming ? "filled" : "outlined"}
                 color={useStreaming ? "success" : "default"}
                 onClick={() => setUseStreaming(!useStreaming)}
                 clickable
                 sx={{ fontSize: '0.6rem', height: 20 }}
               />
               <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.6rem' }}>
                 {useStreaming ? "Real-time responses" : "Standard responses"}
               </Typography>
             </Box>
           </Box>

                     {/* Content */}
           <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
             {error && (
               <Alert severity="error" sx={{ mb: 1.5, fontSize: '0.75rem' }} onClose={() => setError(null)}>
                 {error}
               </Alert>
             )}

             {/* Quick Tools */}
             <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
               Quick Actions
             </Typography>
             <Stack spacing={0.5} sx={{ mb: 2 }}>
               {quickTools.map((tool) => (
                 <Chip
                   key={tool.key}
                   label={tool.label}
                   icon={tool.icon}
                   onClick={() => handleAIAction(tool.action)}
                   clickable
                   variant="outlined"
                   disabled={loading}
                   size="small"
                   sx={{
                     justifyContent: 'flex-start',
                     fontSize: '0.75rem',
                     height: 28,
                     '&:hover': {
                       backgroundColor: 'primary.main',
                       color: 'primary.contrastText',
                     },
                   }}
                 />
               ))}
             </Stack>

             {/* Advanced Tools */}
             <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
               Advanced Tools
             </Typography>
             <Stack spacing={0.5}>
               {advancedTools.map((tool) => (
                 <Chip
                   key={tool.key}
                   label={tool.label}
                   icon={tool.icon}
                   onClick={() => handleAIAction(tool.action)}
                   clickable
                   variant="outlined"
                   disabled={loading}
                   size="small"
                   sx={{
                     justifyContent: 'flex-start',
                     fontSize: '0.75rem',
                     height: 28,
                     '&:hover': {
                       backgroundColor: 'primary.main',
                       color: 'primary.contrastText',
                     },
                   }}
                 />
               ))}
             </Stack>

                           {/* Loading Indicator */}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {useStreaming ? "AI is streaming..." : "AI is processing..."}
                  </Typography>
                </Box>
              )}
           </Box>
                 </Paper>
       </Fade>

      {/* Dialogs */}
      <Dialog open={dialogOpen && dialogType === 'custom'} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>Custom AI Prompt</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom prompt here..."
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleCustomPrompt} variant="contained" disabled={loading}>
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen && dialogType === 'style'} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Change Writing Style</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Target Style</InputLabel>
            <Select
              value={targetStyle}
              onChange={(e) => setTargetStyle(e.target.value)}
              label="Target Style"
            >
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="creative">Creative</MenuItem>
              <MenuItem value="academic">Academic</MenuItem>
              <MenuItem value="conversational">Conversational</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="persuasive">Persuasive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleStyleTransfer} variant="contained" disabled={loading}>
            Transform
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen && dialogType === 'translate'} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Translate Text</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Target Language</InputLabel>
            <Select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              label="Target Language"
            >
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="French">French</MenuItem>
              <MenuItem value="German">German</MenuItem>
              <MenuItem value="Italian">Italian</MenuItem>
              <MenuItem value="Portuguese">Portuguese</MenuItem>
              <MenuItem value="Russian">Russian</MenuItem>
              <MenuItem value="Chinese">Chinese</MenuItem>
              <MenuItem value="Japanese">Japanese</MenuItem>
              <MenuItem value="Korean">Korean</MenuItem>
              <MenuItem value="Arabic">Arabic</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleTranslation} variant="contained" disabled={loading}>
            Translate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen && dialogType === 'expand'} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Expand Text</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Expansion Type</InputLabel>
            <Select
              value={expansionType}
              onChange={(e) => setExpansionType(e.target.value)}
              label="Expansion Type"
            >
              <MenuItem value="adding examples">Adding Examples</MenuItem>
              <MenuItem value="providing more detail">Providing More Detail</MenuItem>
              <MenuItem value="explaining concepts">Explaining Concepts</MenuItem>
              <MenuItem value="adding context">Adding Context</MenuItem>
              <MenuItem value="elaborating on points">Elaborating on Points</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleExpansion} variant="contained" disabled={loading}>
            Expand
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen && dialogType === 'generate'} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>Generate Content</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for content generation..."
            />
            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                label="Content Type"
              >
                <MenuItem value="article">Article</MenuItem>
                <MenuItem value="blog post">Blog Post</MenuItem>
                <MenuItem value="essay">Essay</MenuItem>
                <MenuItem value="story">Story</MenuItem>
                <MenuItem value="poem">Poem</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="social media post">Social Media Post</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Length</InputLabel>
              <Select
                value={contentLength}
                onChange={(e) => setContentLength(e.target.value)}
                label="Length"
              >
                <MenuItem value="short">Short</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="long">Long</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleContentGeneration} variant="contained" disabled={loading}>
            Generate
          </Button>
        </DialogActions>
             </Dialog>

       {/* Token Input Dialog */}
       <Dialog open={showTokenInput} onClose={() => setShowTokenInput(false)} maxWidth="sm" fullWidth>
         <DialogTitle>Add Your GitHub Token</DialogTitle>
         <DialogContent>
           <Typography variant="body2" sx={{ mb: 2 }}>
             To use AI features, you need to add your GitHub Personal Access Token. 
             This token is stored locally in your browser and is not sent to our servers.
           </Typography>
           <TextField
             fullWidth
             label="GitHub Token"
             value={userToken}
             onChange={(e) => setUserToken(e.target.value)}
             placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
             variant="outlined"
             type="password"
             sx={{ mt: 1 }}
           />
           <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
             Don't have a token? <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">Create one here</a>
           </Typography>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setShowTokenInput(false)}>Cancel</Button>
           <Button onClick={handleTokenSubmit} variant="contained">
             Add Token
           </Button>
         </DialogActions>
       </Dialog>
     </>
   );
 };

export default FloatingAITools;
