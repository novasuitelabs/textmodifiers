import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  SmartToy,
  ExpandMore,
  AutoFixHigh,
  Translate,
  Psychology,
  Summarize,
  Edit,
  Add,
  Analytics
} from '@mui/icons-material';
import { AIService } from '../services/aiService';
import type { AIResponse } from '../services/aiService';

interface AIToolsProps {
  inputText: string;
  onOutputChange: (text: string) => void;
}

const AITools: React.FC<AIToolsProps> = ({ inputText, onOutputChange }) => {
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

  const handleAIAction = async (action: () => Promise<AIResponse>) => {
    if (!inputText.trim()) {
      setError('Please enter some text first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await action();
      
      if (result.success && result.content) {
        onOutputChange(result.content);
      } else {
        setError(result.error || 'Failed to process text');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
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

  const aiTools = [
    {
      key: 'summarize',
      label: 'Summarize',
      icon: <Summarize />,
      action: () => AIService.summarizeText(inputText),
      description: 'Create a concise summary of your text'
    },
    {
      key: 'correct',
      label: 'Correct Grammar',
      icon: <AutoFixHigh />,
      action: () => AIService.correctGrammar(inputText),
      description: 'Fix grammar, spelling, and improve writing style'
    },
    {
      key: 'analyze',
      label: 'Analyze Text',
      icon: <Analytics />,
      action: () => AIService.analyzeText(inputText),
      description: 'Get detailed analysis of tone, style, and themes'
    },
    {
      key: 'style',
      label: 'Change Style',
      icon: <Edit />,
      action: () => {
        openDialog('style');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Transform text to different writing styles'
    },
    {
      key: 'translate',
      label: 'Translate',
      icon: <Translate />,
      action: () => {
        openDialog('translate');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Translate text to different languages'
    },
    {
      key: 'expand',
      label: 'Expand Text',
      icon: <Add />,
      action: () => {
        openDialog('expand');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Add more detail and examples to your text'
    },
    {
      key: 'generate',
      label: 'Generate Content',
      icon: <Psychology />,
      action: () => {
        openDialog('generate');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Create new content based on a topic'
    },
    {
      key: 'custom',
      label: 'Custom Prompt',
      icon: <SmartToy />,
      action: () => {
        openDialog('custom');
        return Promise.resolve({ success: false, error: 'Dialog opened' } as AIResponse);
      },
      description: 'Use your own custom AI prompt'
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SmartToy color="primary" />
        AI-Powered Tools
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Quick AI Actions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {aiTools.slice(0, 4).map((tool) => (
              <Chip
                key={tool.key}
                label={tool.label}
                icon={tool.icon}
                onClick={() => handleAIAction(tool.action)}
                clickable
                variant="outlined"
                disabled={loading}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Advanced AI Tools</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {aiTools.slice(4).map((tool) => (
              <Chip
                key={tool.key}
                label={tool.label}
                icon={tool.icon}
                onClick={() => handleAIAction(tool.action)}
                clickable
                variant="outlined"
                disabled={loading}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            AI is processing your text...
          </Typography>
        </Box>
      )}

      {/* Custom Prompt Dialog */}
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

      {/* Style Transfer Dialog */}
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

      {/* Translation Dialog */}
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

      {/* Expansion Dialog */}
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

      {/* Content Generation Dialog */}
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
    </Paper>
  );
};

export default AITools;
