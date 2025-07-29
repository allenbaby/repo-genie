import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Link,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/VpnKey";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onApiKeySet: (apiKey: string) => void;
  onClose: () => void;
}

export const ApiKeyDialog = ({ isOpen, onApiKeySet, onClose }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setApiKey("");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <KeyIcon />
          API Key Required
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2">
            To generate AI-powered project structures, you need a Groq API key.
          </Typography>

          <Box>
            <Typography variant="caption" display="block" gutterBottom>
              Get your free API key from Groq Console:
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => window.open("https://console.groq.com/", "_blank")}
              startIcon={<OpenInNewIcon />}
            >
              Open Groq Console
            </Button>
          </Box>

          <TextField
            label="API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_..."
            fullWidth
            InputProps={{ sx: { fontFamily: "monospace" } }}
          />

          <Box sx={{ fontSize: "0.75rem", color: "gray" }}>
            <ul style={{ paddingLeft: "1.2em", margin: 0 }}>
              <li>Your API key is stored locally in your browser</li>
              <li>Groq offers a free tier with generous limits</li>
              <li>Uses Llama 3.3 70B model for best results</li>
            </ul>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" disabled={!apiKey.trim()} variant="contained">
            Set API Key
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
