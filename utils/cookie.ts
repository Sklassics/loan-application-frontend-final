import Cookies from 'js-cookie';

const cookie = {
  setToken: (token: string) => {
    Cookies.set('token', token, {
      expires: 1 / 24, // 1 hour
      secure: true,
      sameSite: 'strict',
    });
  },
  getToken: () => {
    return Cookies.get('token');
  },
};

export default cookie;