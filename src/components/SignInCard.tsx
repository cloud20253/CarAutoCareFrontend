import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SignInUser } from '../Services/userService';
import { jwtDecode , JwtPayload } from "jwt-decode";
import { ArrowBack } from "@mui/icons-material";

interface MyJwtPayload extends JwtPayload {
  authorities: string[];
  roles: string[];
 
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [email , setEmail ] = React.useState('');
  const [password , setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const data = {
        username : email ,
        password
      }
      const response = await SignInUser(data);
     console.log(response);
     const decodedToken = jwtDecode<MyJwtPayload>(response);

      console.log("Decoded Token:", decodedToken?.authorities[0]);
      localStorage.setItem("token",response)
      localStorage.setItem("userData", JSON.stringify(decodedToken));
      navigate("/");
    } catch (err) {
      console.error("Error signing in:", err);
      alert("Sign-in failed. Please check your credentials.");
    }
  };


  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <>

 
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex',  } }}>
        <RouterLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", color: "inherit" }}>
  <ArrowBack sx={{ mr: 1 }} /> Car Auto Care
</RouterLink>
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        /> */}
        <br/>
        <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
          Sign in
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <span>
            <Link
              component={RouterLink}
              to="/signup"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </span>
        </Typography>
      </Box>
        <ForgotPassword open={open} handleClose={handleClose} />
      {/* <Divider>or</Divider> */}
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Facebook')}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button> */}
      {/* </Box> */}
    </Card>
    </>
  );
}



// Functionality to have signout when tab is closed

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import MuiCard from '@mui/material/Card';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import Link from '@mui/material/Link';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import { styled } from '@mui/material/styles';
// import ForgotPassword from './ForgotPassword';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { SignInUser } from '../Services/userService';
// import { jwtDecode , JwtPayload } from "jwt-decode";
// import { ArrowBack } from "@mui/icons-material";

// interface MyJwtPayload extends JwtPayload {
//   authorities: string[];
//   roles: string[];
// }

// const Card = styled(MuiCard)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignSelf: 'center',
//   width: '100%',
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   boxShadow:
//     'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
//   [theme.breakpoints.up('sm')]: {
//     width: '450px',
//   },
//   ...theme.applyStyles('dark', {
//     boxShadow:
//       'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
//   }),
// }));

// export default function SignInCard() {
//   const [emailError, setEmailError] = React.useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
//   const [passwordError, setPasswordError] = React.useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
//   const [open, setOpen] = React.useState(false);
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const navigate = useNavigate();

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!validateInputs()) {
//       return;
//     }

//     try {
//       const data = {
//         username: email,
//         password,
//       };
//       const response = await SignInUser(data);
//       console.log(response);
      
//       const decodedToken = jwtDecode<MyJwtPayload>(response);
//       console.log("Decoded Token:", decodedToken?.authorities[0]);

//       // Store token and user data in sessionStorage for session-only persistence
//       sessionStorage.setItem("token", response);
//       sessionStorage.setItem("userData", JSON.stringify(decodedToken));

//       navigate("/");
//     } catch (err) {
//       console.error("Error signing in:", err);
//       alert("Sign-in failed. Please check your credentials.");
//     }
//   };

//   const validateInputs = () => {
//     const emailField = document.getElementById('email') as HTMLInputElement;
//     const passwordField = document.getElementById('password') as HTMLInputElement;

//     let isValid = true;

//     if (!emailField.value || !/\S+@\S+\.\S+/.test(emailField.value)) {
//       setEmailError(true);
//       setEmailErrorMessage('Please enter a valid email address.');
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage('');
//     }

//     if (!passwordField.value || passwordField.value.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMessage('Password must be at least 6 characters long.');
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage('');
//     }

//     return isValid;
//   };

//   return (
//     <>
//       <Card variant="outlined">
//         <Box sx={{ display: { xs: 'flex' } }}>
//           <RouterLink
//             to="/"
//             style={{
//               textDecoration: "none",
//               display: "flex",
//               alignItems: "center",
//               color: "inherit",
//             }}
//           >
//             <ArrowBack sx={{ mr: 1 }} /> Car Auto Care
//           </RouterLink>
//         </Box>
//         <Typography
//           component="h1"
//           variant="h4"
//           sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
//         >
//           Sign in
//         </Typography>
//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           noValidate
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             width: '100%',
//             gap: 2,
//           }}
//         >
//           <FormControl>
//             <FormLabel htmlFor="email">Email</FormLabel>
//             <TextField
//               error={emailError}
//               helperText={emailErrorMessage}
//               id="email"
//               type="email"
//               name="email"
//               placeholder="your@email.com"
//               autoComplete="email"
//               autoFocus
//               required
//               fullWidth
//               variant="outlined"
//               color={emailError ? 'error' : 'primary'}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </FormControl>
//           <FormControl>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//               <FormLabel htmlFor="password">Password</FormLabel>
//               <Link
//                 component="button"
//                 type="button"
//                 onClick={handleClickOpen}
//                 variant="body2"
//                 sx={{ alignSelf: 'baseline' }}
//               >
//                 Forgot your password?
//               </Link>
//             </Box>
//             <TextField
//               error={passwordError}
//               helperText={passwordErrorMessage}
//               name="password"
//               placeholder="••••••"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               required
//               fullWidth
//               variant="outlined"
//               color={passwordError ? 'error' : 'primary'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </FormControl>
//           <br />
//           <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
//             Sign in
//           </Button>
//           <Typography sx={{ textAlign: 'center' }}>
//             Don&apos;t have an account?{' '}
//             <span>
//               <Link component={RouterLink} to="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
//                 Sign up
//               </Link>
//             </span>
//           </Typography>
//         </Box>
//         <ForgotPassword open={open} handleClose={handleClose} />
//       </Card>
//     </>
//   );
// }
