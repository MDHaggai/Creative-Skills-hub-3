import { Stack, Typography, useTheme } from "@mui/material"

const FullTitleElement = ({isDark = false}) => {
    const theme = useTheme();
    const titleStyle = {fontSize: {xs: '30px', md: '35px', lg: '40px'}, fontWeight: 700};
    return (
        <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='center'>
            <Typography variant="h4" sx={{ ...titleStyle, color: theme.palette.primary.main }}>Creative</Typography>
            <Typography variant="h4" sx={{ ...titleStyle, color: isDark ? '#000' : '#FFF'}}>Skills</Typography>
            <Typography variant="h4" sx={{ ...titleStyle, color: theme.palette.secondary.main }}>Hub</Typography>
        </Stack>
    )
}

export { FullTitleElement }