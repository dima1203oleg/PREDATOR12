import { useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useTranslation } from 'react-i18next';

export function Chat() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openWebUiUrl = useMemo(() => import.meta.env.VITE_OPENWEBUI_URL as string | undefined, []);

  const handleSend = () => {
    // Wire up to POST /api/chat when backend is ready
    if (!message.trim()) return;
    console.info('Send chat message', { message });
    setMessage('');
  };

  const handleVoice = () => {
    console.info('Trigger STT microphone');
  };

  const handleTts = () => {
    console.info('Trigger TTS playback');
  };

  const handleFeedback = (value: 'up' | 'down') => {
    console.info('Send feedback', value);
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.info('Attach file', file.name, file.type, file.size);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('chatTitle')}
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography color="text.secondary">{t('chatDescription')}</Typography>
        <Box sx={{ mt: 2, height: 420, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default' }}>
          {openWebUiUrl ? (
            <iframe title="OpenWebUI" src={openWebUiUrl} style={{ width: '100%', height: '100%', border: 0 }} />
          ) : (
            <Box
              sx={{
                height: '100%',
                border: '1px dashed',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            >
              {t('openWebUiUnavailable')}
            </Box>
          )}
        </Box>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={t('attachFile')}>
              <IconButton color="primary" onClick={handleAttachClick} aria-label={t('attachFile')}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('voiceInput')}>
              <IconButton color="primary" onClick={handleVoice} aria-label={t('voiceInput')}>
                <MicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('textToSpeech')}>
              <IconButton color="primary" onClick={handleTts} aria-label={t('textToSpeech')}>
                <VolumeUpIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <TextField
            fullWidth
            placeholder={t('messagePlaceholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            minRows={2}
          />
          <Button variant="contained" onClick={handleSend} sx={{ minWidth: 120 }}>
            {t('send')}
          </Button>
        </Stack>
        <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('feedback')}:
          </Typography>
          <Tooltip title={t('thumbsUp')}>
            <IconButton color="success" onClick={() => handleFeedback('up')} aria-label={t('thumbsUp')}>
              <ThumbUpAltOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('thumbsDown')}>
            <IconButton color="error" onClick={() => handleFeedback('down')} aria-label={t('thumbsDown')}>
              <ThumbDownAltOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </Box>
  );
}
