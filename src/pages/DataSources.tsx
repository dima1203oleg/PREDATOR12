import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTranslation } from 'react-i18next';

const pipeline = ['stageUpload', 'stageParsing', 'stageValidation', 'stageIndexing', 'stageDone'];

export function DataSources() {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dataSourcesTitle')}
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>{t('uploadInstruction')}</Typography>
        <Button variant="contained" startIcon={<UploadFileIcon />} sx={{ mt: 1 }}>
          {t('chooseFile')}
        </Button>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('etlPipeline')}
        </Typography>
        <Stack spacing={2}>
          {pipeline.map((stage, idx) => (
            <Box key={stage}>
              <Typography variant="subtitle2">{t(stage)}</Typography>
              <LinearProgress variant={idx < 3 ? 'determinate' : 'indeterminate'} value={idx * 25} />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
