import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  Shuffle,
  ContentCopy,
  AutoStories,
  Business,
  Science,
  Psychology,
  Language,
  Code,
  Email,
  Article
} from '@mui/icons-material';

interface SampleTextsProps {
  onTextSelect: (text: string) => void;
}

const sampleTexts = {
  business: {
    title: "Business Report",
    icon: <Business />,
    text: "The quarterly financial analysis indicates a 15% increase in revenue compared to the previous period. Market expansion initiatives have shown promising results, with customer acquisition rates improving by 23%. However, operational costs have risen by 8%, primarily due to increased marketing expenditures and infrastructure investments. The board recommends continued focus on digital transformation and customer experience optimization."
  },
  creative: {
    title: "Creative Story",
    icon: <AutoStories />,
    text: "The old lighthouse stood sentinel on the rocky coast, its beam cutting through the misty darkness like a sword of light. Sarah had spent her childhood summers here, watching the waves crash against the weathered stones. Now, returning as an adult, she felt the same sense of wonder that had captured her imagination all those years ago. The salty breeze carried memories of simpler times."
  },
  academic: {
    title: "Academic Paper",
    icon: <Science />,
    text: "The study examined the correlation between social media usage and mental health outcomes in adolescents aged 13-18. Results indicated a statistically significant relationship between increased screen time and elevated anxiety levels (p < 0.05). However, the research also revealed that moderated use of educational platforms showed positive effects on cognitive development. Further longitudinal studies are recommended to establish causal relationships."
  },
  technical: {
    title: "Technical Documentation",
    icon: <Code />,
    text: "The API endpoint /api/users/{id} accepts GET requests with optional query parameters for filtering results. Authentication requires a valid JWT token in the Authorization header. Response format follows JSON:API specification with pagination support. Rate limiting is enforced at 100 requests per minute per API key. Error responses include appropriate HTTP status codes and detailed error messages."
  },
  casual: {
    title: "Casual Email",
    icon: <Email />,
    text: "Hey there! Just wanted to check in and see how things are going with the project. I know we've been working on this for a while now, and I wanted to make sure we're all on the same page. Let me know if you need any help or if there's anything I can do to support the team. Looking forward to catching up soon!"
  },
  persuasive: {
    title: "Persuasive Article",
    icon: <Article />,
    text: "Climate change represents the most pressing challenge of our generation. The scientific evidence is overwhelming: global temperatures are rising, sea levels are increasing, and extreme weather events are becoming more frequent. We must act now to reduce carbon emissions and transition to renewable energy sources. The cost of inaction far exceeds the investment required for sustainable solutions."
  },
  psychological: {
    title: "Psychology Analysis",
    icon: <Psychology />,
    text: "Cognitive behavioral therapy (CBT) focuses on identifying and modifying maladaptive thought patterns that contribute to emotional distress. The therapeutic process involves collaborative exploration of automatic thoughts, cognitive distortions, and behavioral responses. Research demonstrates CBT's effectiveness in treating depression, anxiety disorders, and various other mental health conditions."
  },
  multilingual: {
    title: "Multilingual Text",
    icon: <Language />,
    text: "Welcome to our international conference! Bienvenue à notre conférence internationale! Willkommen zu unserer internationalen Konferenz! Benvenuti alla nostra conferenza internazionale! ¡Bienvenidos a nuestra conferencia internacional! We are excited to bring together experts from around the world to share knowledge and foster collaboration."
  }
};

const SampleTexts: React.FC<SampleTextsProps> = ({ onTextSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleRandomText = () => {
    const categories = Object.keys(sampleTexts);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setSelectedCategory(randomCategory);
    onTextSelect(sampleTexts[randomCategory as keyof typeof sampleTexts].text);
  };

  const handleTextSelect = (category: string) => {
    setSelectedCategory(category);
    onTextSelect(sampleTexts[category as keyof typeof sampleTexts].text);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoStories />
          Sample Texts
        </Typography>
        <Tooltip title="Get Random Sample">
          <IconButton onClick={handleRandomText} color="primary">
            <Shuffle />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose sample text to test different AI functionalities
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2">Text Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {Object.entries(sampleTexts).map(([key, sample]) => (
              <Box
                key={key}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  border: selectedCategory === key ? '2px solid' : '1px solid',
                  borderColor: selectedCategory === key ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  backgroundColor: selectedCategory === key ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  {sample.icon}
                  <Typography variant="body2" sx={{ fontWeight: selectedCategory === key ? 600 : 400 }}>
                    {sample.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Use this text">
                    <Chip
                      label="Use"
                      size="small"
                      onClick={() => handleTextSelect(key)}
                      color={selectedCategory === key ? 'primary' : 'default'}
                      variant={selectedCategory === key ? 'filled' : 'outlined'}
                      sx={{ fontSize: '0.7rem', height: 24 }}
                    />
                  </Tooltip>
                  <Tooltip title="Copy text">
                    <IconButton
                      size="small"
                      onClick={() => handleCopyText(sample.text)}
                      sx={{ p: 0.5 }}
                    >
                      <ContentCopy sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {selectedCategory && (
        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {sampleTexts[selectedCategory as keyof typeof sampleTexts].icon}
            {sampleTexts[selectedCategory as keyof typeof sampleTexts].title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            {sampleTexts[selectedCategory as keyof typeof sampleTexts].text}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="Test Summarization"
          size="small"
          variant="outlined"
          onClick={() => selectedCategory && handleTextSelect(selectedCategory)}
          disabled={!selectedCategory}
        />
        <Chip
          label="Test Grammar"
          size="small"
          variant="outlined"
          onClick={() => selectedCategory && handleTextSelect(selectedCategory)}
          disabled={!selectedCategory}
        />
        <Chip
          label="Test Translation"
          size="small"
          variant="outlined"
          onClick={() => selectedCategory && handleTextSelect(selectedCategory)}
          disabled={!selectedCategory}
        />
      </Box>
    </Paper>
  );
};

export default SampleTexts;
