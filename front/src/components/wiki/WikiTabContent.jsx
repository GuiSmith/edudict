import { Box, Divider, List, ListItem, Typography } from "@mui/material";

function SectionBlock({ block }) {
  return (
    <Box component="section" sx={{ py: 2.75 }}>
      <Typography component="h3" variant="h3" sx={{ mb: 1.5 }}>
        {block.title}
      </Typography>
      <List dense disablePadding>
        {block.items.map((item) => (
          <ListItem
            key={item}
            disableGutters
            sx={{
              alignItems: "flex-start",
              color: "text.secondary",
              display: "list-item",
              listStylePosition: "outside",
              listStyleType: "disc",
              ml: 2.5,
              py: 0.45,
            }}
          >
            <Typography component="span" variant="body2">
              {item}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default function WikiTabContent({ blocks, description, title }) {
  return (
    <Box sx={{ maxWidth: 860 }}>
      <Box sx={{ pb: 2.75 }}>
        <Typography component="h2" variant="h2">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.25 }} variant="body1">
          {description}
        </Typography>
      </Box>

      <Divider />

      {blocks.map((block, index) => (
        <Box key={block.title}>
          <SectionBlock block={block} />
          {index < blocks.length - 1 ? <Divider /> : null}
        </Box>
      ))}
    </Box>
  );
}
