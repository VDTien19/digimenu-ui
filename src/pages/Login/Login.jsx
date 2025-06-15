import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faTwitter,
    faGoogle,
    faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

import styles from './Login.module.scss';
import images from '~/assets/images';
import { useSlug } from '~/contexts/SlugContext';
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function Login() {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { login, userData, isAuthenticated } = useAuth();
    const { slug } = useSlug();
    const navigate = useNavigate();

    // console.log('user: ', user);

    useEffect(() => {
        const signInBtn = document.getElementById('sign-in-btn');
        const signUpBtn = document.getElementById('sign-up-btn');
        const container = document.querySelector(`.${cx('container')}`);

        const handleSignUp = () => container.classList.add(cx('sign-up-mode'));
        const handleSignIn = () =>
            container.classList.remove(cx('sign-up-mode'));

        signUpBtn.addEventListener('click', handleSignUp);
        signInBtn.addEventListener('click', handleSignIn);

        return () => {
            signUpBtn.removeEventListener('click', handleSignUp);
            signInBtn.removeEventListener('click', handleSignIn);
        };
    }, []);

    const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const user = await login(loginData.email, loginData.password);
        if (!user) {
            setError('Sai tài khoản hoặc mật khẩu');
            return;
        }

        // ✅ Điều hướng dựa trên role
        if (user.role === 'staff') {
            navigate(`/${slug}/service`);
        } else if (user.role === 'admin') {
            navigate(`/${slug}/admin`);
        } else {
            navigate('/');
        }
    } catch (err) {
        setError(err.message || 'Lỗi đăng nhập');
    }
};


    // const handleRegister = async (e) => {
    //     e.preventDefault();
    //     try {
    //         setError('');
    //         const res = await register(registerData);
    //         console.log('Register success:', res);
    //     } catch (err) {
    //         setError(err.message || 'Lỗi đăng ký');
    //     }
    // };

    return (
        <div className={cx('container')}>
            <div className={cx('forms-container')}>
                <div className={cx('signin-signup')}>
                    <form
                        action="#"
                        className={cx('sign-in-form')}
                        onSubmit={handleLogin}
                    >
                        <h2 className={cx('title')}>Đăng nhập</h2>
                        <div className={cx('input-field')}>
                            <div className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <input
                                type="text"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className={cx('input-field')}>
                            <div className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>
                        {error && (
                            <p className={cx('error-message')}>{error}</p>
                        )}
                        <input
                            type="submit"
                            value="Đăng nhập"
                            className={cx('btn', 'solid')}
                        />
                        <p className={cx('social-text')}>
                            hoặc đăng nhập bằng tài khoản mạng xã hội
                        </p>
                        <div className={cx('social-media')}>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faGoogle} />
                            </a>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </div>
                    </form>

                    <form action="#" className={cx('sign-up-form')}>
                        <h2 className={cx('title')}>Đăng ký</h2>
                        <div className={cx('input-field')}>
                            <div className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <input
                                type="text"
                                placeholder="Username"
                                value={registerData.username}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        username: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className={cx('input-field')}>
                            <div className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className={cx('input-field')}>
                            <div className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <input
                            type="submit"
                            className={cx('btn')}
                            value="Đăng ký"
                        />
                        <p className={cx('social-text')}>
                            hoặc đăng ký bằng tài khoản mạng xã hội
                        </p>
                        <div className={cx('social-media')}>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faGoogle} />
                            </a>
                            <a href="#" className={cx('social-icon')}>
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <div className={cx('panels-container')}>
                <div className={cx('panel', 'left-panel')}>
                    <div className={cx('content')}>
                        <h3>Bạn chưa có tài khoản?</h3>
                        <p>
                            Đăng ký ngay để trải nghiệm những tính năng tuyệt
                            vời của chúng tôi. Chỉ mất vài phút!
                        </p>
                        <button
                            className={cx('btn', 'transparent')}
                            id="sign-up-btn"
                        >
                            Đăng ký
                        </button>
                    </div>
                    <img
                        src={images.loginImg}
                        className={cx('image')}
                        alt="login"
                    />
                </div>
                <div className={cx('panel', 'right-panel')}>
                    <div className={cx('content')}>
                        <h3>Bạn đã có tài khoản?</h3>
                        <p>
                            Đăng nhập ngay để tiếp tục sử dụng dịch vụ của chúng
                            tôi. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
                        </p>
                        <button
                            className={cx('btn', 'transparent')}
                            id="sign-in-btn"
                        >
                            Đăng nhập
                        </button>
                    </div>
                    <img
                        src={images.registerImg}
                        className={cx('image')}
                        alt="register"
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
