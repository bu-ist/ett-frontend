import Cookies from 'js-cookie';

export default function LogoutPage() {
    // Clear the cookies
    Cookies.remove('EttAccessJwt');
    Cookies.remove('EttIdJwt');

    return (
        <div>
            <p>Logged out</p>
        </div>
    );
}
