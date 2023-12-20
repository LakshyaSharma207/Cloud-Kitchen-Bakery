import React, { useEffect, useState } from 'react'
import { LoginBg, Logo } from '../../assets/index';
import Forms from './Forms';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";
// // Auth imports
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "../../config/firebase.config"
import { validateUserJWTToken } from '../../api/index';
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "../../context/actions/userActions";
import { useDispatch, useSelector } from 'react-redux';

export default function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  useEffect(() => {
      if(user) {
          navigate("/", { replace: true })
      }
  }, [user]);
  
  const loginWithGoogle = async () => { setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  
    await signInWithPopup(firebaseAuth, provider)
        .then(userCred => {
            firebaseAuth.onAuthStateChanged(cred => {
                if(cred) {
                    cred.getIdToken().then(token => {
                        validateUserJWTToken(token)
                            .then(data => {
                              dispatch(setUserDetails(data));
                        });
                        navigate("/", {replace: true})
                    })
                }
            })
        })
}

const signUpWithEmailPass = async () => { setIsClicked(true);
  setTimeout(() => {
    setIsClicked(false);
  }, 100);

  if(userEmail !== '' || password !== '' || confirmPass !== '') {
    try {
      if(password === confirmPass) {
          setUserEmail("");
          setConfirmPass("");
          setPassword("");
          await createUserWithEmailAndPassword(firebaseAuth, userEmail, password)
              .then(userCred => {
                  firebaseAuth.onAuthStateChanged(cred => {
                      if(cred) {
                          cred.getIdToken().then(token => {
                              validateUserJWTToken(token)
                                  .then(data => {
                                      dispatch(setUserDetails(data));
                              });
                              navigate("/", {replace: true})
                          })
                      }
                  })
              })
        }   
      } catch(error) {
        setErrorMessage('Passwords dont match');
      }
  }
  else {
    setErrorMessage('No email or password provided');
  }
};

const signInWithEmailPass = async () => { setIsClicked(true);
  setTimeout(() => {
    setIsClicked(false);
  }, 100);

  if(userEmail !== '' || password !== '') {
    try {
      await signInWithEmailAndPassword(firebaseAuth, userEmail, password)
          .then(userCred => {
              firebaseAuth.onAuthStateChanged(cred => {
                  if(cred) {
                      cred.getIdToken().then(token => {
                          validateUserJWTToken(token)
                              .then(data => {
                                  dispatch(setUserDetails(data));
                          });
                          navigate("/", {replace: true})
                      })
                  }
                })
              })
          } catch (error) {
            setErrorMessage('Incorrect email or password');
          }
  }
  else{
    setErrorMessage('No email or password provided');
  }
};

  return (
    <div className='w-screen h-screen relative overflow-hidden flex justify-center items-center'>
        {/* background image  */}
        <img 
        src={LoginBg} 
        className='w-full h-full object-cover absolute top-0 left-0'
        alt="background" 
        />

        {/* Content Box */}
        <div className='flex flex-col items-center bg-themeColor w-[40%] h-[80%] rounded-lg backdrop-blur-md gap-6 bg-opacity-70 z-10'>
          <img src={Logo} className='w-[255px]' />

          <p className=' text-3xl font-semibold text-slate-900'>Welcome Back</p>
            <p className=' text-xl text-slate-900 -mt-6'>{isSignUp ? "Sign-up" : "Sign-in" } with following</p>
          {/* Input Section */}
          <div className=' w-[100%] flex flex-col items-center justify-center gap-5 px-4 md:px-12 py-4'>
            <Forms
                placeholder={"Email Here"} 
                inputState={userEmail}
                inputStateFunction={setUserEmail}
                type="email"
                icon={<MdEmail className='text-3xl text-yellow-950'/>}
            />
            <Forms 
                placeholder={"Password Here"}
                inputState={password}
                inputStateFunction={setPassword}
                type="password"
                icon={<RiLockPasswordFill className='text-3xl text-yellow-950'/>}
            />
            {isSignUp && (
              <Forms 
                  placeholder={"Confirm Password Here"} 
                  inputState={confirmPass}
                  inputStateFunction={setConfirmPass}
                  type="password"
                  icon={<RiLockPasswordFill className='text-3xl text-yellow-950'/>}
              />
            )}

            {!isSignUp 
              ? (<p className='text-slate-900'>Don't have an account?{" "} 
                    <button className='text-yellow-950 underline font-semibold cursor-pointer bg-transparent'
                    onClick={() => setIsSignUp(true)}
                    >
                        Sign-up Here
                    </button>
                  </p>) 
              : (<p className='text-slate-900'>
                  Already have and account?{" "}
                    <button className='text-yellow-950 font-semibold underline cursor-pointer bg-transparent'
                    onClick={() => setIsSignUp(false)}
                    >
                        Sign-in Here
                    </button>
                </p>)
              }
              {/* button section */}
              {isSignUp 
                ? (<button className={`w-[70%] px-4 py-2 rounded-md bg-yellow-950 cursor-pointer text-white text-xl capitalize hover:bg-yellow-900 transition-all duration-150 ${isClicked ? 'transform scale-95' : ''}`}
                    onClick={signUpWithEmailPass}>
                    Sign Up
                   </button>)
                : (<button className={`w-[70%] px-4 py-2 rounded-md bg-yellow-950 cursor-pointer text-white text-xl capitalize hover:bg-yellow-900 transition-all duration-150 ${isClicked ? 'transform scale-95' : ''}`}
                    onClick={signInWithEmailPass}>
                    Sign In
                   </button>)
                }
              {errorMessage && <p className='text-red-900'>{errorMessage}</p>}
          </div>
            {/* Google section */}
              <div className='flex items-center justify-center px-20 py-2 bg-slate-100 backdrop-blur-md cursor-pointer rounded-3xl gap-4' onClick={loginWithGoogle}
              >
                <FaGoogle className='text-3xl text-yellow-950'/>
                <p className='text-base text-yellow-950'>Sign in with Google</p>
            </div>
        </div>
    </div>
  )
}
