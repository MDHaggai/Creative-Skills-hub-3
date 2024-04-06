import { Link } from "react-router-dom"
import { Button } from "@mui/material"

const LandingPage = () => {
    return (
        <Link to='./auth/login'><Button>Go to Login</Button></Link>
    )
}

export default LandingPage;