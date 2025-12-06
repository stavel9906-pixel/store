import { Box, Avatar, Paper, Typography } from "@mui/material";

type ChatBubbleProps = {
  avatarUrl: string;
  name: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
};

export const ChatBubble = ({
  avatarUrl,
  text,
  timestamp,
  isOwn,
}: ChatBubbleProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        mb: 2,
        gap: 0.5
      }}
    >
      <Avatar
        src={avatarUrl}
        sx={{ width: 40, height: 40, ml: isOwn ? 1 : 0, mr: isOwn ? 0 : 1 }}
      />
      <Box sx={{ maxWidth: "70%" }}>
        <Paper
          sx={{
            p: 1.5,
            bgcolor: isOwn ? "primary.main" : "grey.100",
            color: isOwn ? "primary.contrastText" : "text.primary",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{ textAlign: "left", display: "block" }}
          >
            {text}
          </Typography>
        </Paper>
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: "block",
            textAlign: isOwn ? "right" : "left",
          }}
        >
          {timestamp.slice(0,5)}
        </Typography>
      </Box>
    </Box>
  );
};
